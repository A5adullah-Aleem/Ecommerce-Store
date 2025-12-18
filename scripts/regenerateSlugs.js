const { createClient } = require("@supabase/supabase-js");

// Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qvitzhcfkugurzlgthff.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2aXR6aGNma3VndXJ6bGd0aGZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MDc5NTcsImV4cCI6MjA3NzM4Mzk1N30.J9YoAygYJbv8Ja_Rm9yIQyPu0Nr6ZKmNUv8udywS3og";

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Generates a URL-friendly slug from a string
 */
function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Remove accents/diacritics
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove all non-word characters except hyphens
    .replace(/[^\w\-]+/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/\-\-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Generate unique slug checking against existing slugs
 */
async function generateUniqueSlug(name, excludeId, existingSlugs) {
  let baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;

  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

async function regenerateAllSlugs() {
  console.log("🔧 Regenerating Slugs for All Products");
  console.log("=====================================\n");

  try {
    // Fetch all products
    const { data: products, error: fetchError } = await supabase
      .from("products")
      .select("id, name, slug")
      .order("created_at", { ascending: true });

    if (fetchError) throw fetchError;

    if (!products || products.length === 0) {
      console.log("❌ No products found in database");
      return;
    }

    console.log(`📦 Found ${products.length} products\n`);

    // Track used slugs to ensure uniqueness
    const usedSlugs = new Set();
    const updates = [];

    for (const product of products) {
      const newSlug = await generateUniqueSlug(product.name, product.id, usedSlugs);
      usedSlugs.add(newSlug);

      if (product.slug !== newSlug) {
        updates.push({
          id: product.id,
          name: product.name,
          oldSlug: product.slug,
          newSlug: newSlug,
        });
      }
    }

    if (updates.length === 0) {
      console.log("✅ All slugs are already correct!");
      return;
    }

    console.log(`🔄 Updating ${updates.length} products:\n`);

    for (const update of updates) {
      console.log(`  "${update.name}"`);
      console.log(`    Old: ${update.oldSlug || "(none)"}`);
      console.log(`    New: ${update.newSlug}\n`);

      const { error: updateError } = await supabase
        .from("products")
        .update({ slug: update.newSlug })
        .eq("id", update.id);

      if (updateError) {
        console.error(`  ❌ Error updating: ${updateError.message}`);
      } else {
        console.log(`    ✅ Updated successfully`);
      }
    }

    console.log("\n🎉 Done! All slugs have been regenerated.");
    console.log("\nExample URLs:");
    updates.slice(0, 5).forEach((u) => {
      console.log(`  /products/${u.newSlug}`);
    });

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

regenerateAllSlugs();

