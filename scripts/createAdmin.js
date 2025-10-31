const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcryptjs");

// Supabase credentials
const supabaseUrl = "https://qvitzhcfkugurzlgthff.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2aXR6aGNma3VndXJ6bGd0aGZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MDc5NTcsImV4cCI6MjA3NzM4Mzk1N30.J9YoAygYJbv8Ja_Rm9yIQyPu0Nr6ZKmNUv8udywS3og";

const supabase = createClient(supabaseUrl, supabaseKey);

async function ensureAdmin() {
  console.log("🔧 Checking or creating Admin User");
  console.log("====================================\n");

  const email = "admin@glamourcosmetics.com";
  const password = "admin123";
  const name = "Admin User";

  try {
    // 1. Check if admin exists
    const { data: existing, error: fetchError } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email);

    if (fetchError) throw fetchError;

    if (existing.length > 0) {
      console.log("✅ Admin already exists. Updating password...");
      const hashed = await bcrypt.hash(password, 10);

      const { error: updateError } = await supabase
        .from("admins")
        .update({ password: hashed })
        .eq("email", email);

      if (updateError) throw updateError;
      console.log("✅ Password reset successfully!");
    } else {
      console.log("⚙️  No admin found. Creating new one...");
      const hashed = await bcrypt.hash(password, 10);

      const { error: insertError } = await supabase.from("admins").insert([
        {
          email,
          password: hashed,
          name,
          role: "admin",
        },
      ]);

      if (insertError) throw insertError;
      console.log("✅ Admin created successfully!");
    }

    console.log("\n🎉 Done!");
    console.log("Login with:");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

ensureAdmin();
