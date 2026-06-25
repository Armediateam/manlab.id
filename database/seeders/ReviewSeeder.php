<?php

namespace Database\Seeders;

use App\Models\Review;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reviews = [
            [
                'id' => 1,
                'client_id' => 1,
                'name' => 'Chung Min',
                'nick_or_company' => 'Hansung Apartment',
                'email' => 'chung@example.com',
                'selected' => true,
                'top8' => true,
                'thumbnail_before' => 'https://dummyimage.com/512x512/000/fff',
                'thumbnail_after' => 'https://dummyimage.com/512x512/000/fff',
                'register_start_date' => '2026-06-01',
                'register_end_date' => '2026-06-20',
                'category' => 'Total Interior',
                'selected_vendor' => 'Manlab Direct',
                'like' => 128,
                'view_status' => 'Viewing',
                'notes' => 'Selected total interior review for homepage viewing.',
            ],
            [
                'id' => 2,
                'client_id' => 2,
                'name' => 'Reiza Putri',
                'nick_or_company' => 'PT Apollo',
                'email' => 'reiza@example.com',
                'selected' => true,
                'top8' => false,
                'thumbnail_before' => 'https://dummyimage.com/512x512/000/fff',
                'thumbnail_after' => 'https://dummyimage.com/512x512/000/fff',
                'register_start_date' => '2026-05-10',
                'register_end_date' => '2026-05-28',
                'category' => 'Floor',
                'selected_vendor' => 'Vendor A',
                'like' => 84,
                'view_status' => 'Viewing',
                'notes' => 'Partial floor work review.',
            ],
            [
                'id' => 3,
                'client_id' => 3,
                'name' => 'Suci Rahma',
                'nick_or_company' => 'CV Maju',
                'email' => 'suci@example.com',
                'selected' => false,
                'top8' => false,
                'thumbnail_before' => 'https://dummyimage.com/512x512/000/fff',
                'thumbnail_after' => 'https://dummyimage.com/512x512/000/fff',
                'register_start_date' => '2026-04-12',
                'register_end_date' => '2026-04-30',
                'category' => 'Ceil',
                'selected_vendor' => 'PT 1',
                'like' => 45,
                'view_status' => 'Hidden',
                'notes' => 'Hidden preview ceil work.',
            ],
        ];

        foreach ($reviews as $review) {
            Review::create($review);
        }
    }
}
