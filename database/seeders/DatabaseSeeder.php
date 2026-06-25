<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed test user if not exists
        if (!User::where('email', 'admin@manlab.id')->exists()) {
            User::factory()->create([
                'name' => 'Admin Mandorlab',
                'email' => 'admin@manlab.id',
                'role' => 'admin',
                'password' => bcrypt('0000'),
            ]);
        }

        $this->call([
            ClientSeeder::class,
            QuotationSeeder::class,
            MessageSeeder::class,
            ReviewSeeder::class,
        ]);

        // Seed client users corresponding to our seeded clients:
        $clientEmails = [
            'chung@manlab.id' => 'Chung',
            'reiza@hansung.com' => 'Reiza',
            'suci@ptxxx.co.id' => 'Suci',
            'dwikky@dongyang.com' => 'Dwikky',
            'henry@apollo.com' => 'Henry',
        ];

        foreach ($clientEmails as $email => $name) {
            if (!User::where('email', $email)->exists()) {
                User::factory()->create([
                    'name' => $name,
                    'email' => $email,
                    'role' => 'client',
                    'password' => bcrypt('0000'),
                ]);
            }
        }
    }
}
