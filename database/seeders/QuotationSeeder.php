<?php

namespace Database\Seeders;

use App\Models\Quotation;
use Illuminate\Database\Seeder;

class QuotationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $quotations = [
            [
                'id' => 1,
                'no' => 100,
                'client_id' => 1,
                'name' => 'Chung',
                'nick_or_company' => 'Mandor Lab',
                'photo_url' => 'https://dummyimage.com/512x512/000/fff',
                'preferred_contact' => 'WA',
                'route' => 'D',
                'visit' => 'Y',
                'visit_date_time' => '2026-06-28 10:00',
                'total_partial' => 'Total',
                'cate' => '-',
                'budget' => 'Rp 50.000.000',
                'ownership' => 'Owner',
                'building_type' => 'Mall',
                'location' => 'Jakarta Selatan',
                'special_req' => 'Use premium material',
                'request_date' => '2026-06-24',
                'reply_quo' => 'Replied',
            ],
            [
                'id' => 2,
                'no' => 99,
                'client_id' => 2,
                'name' => 'Reiza',
                'nick_or_company' => 'Hansung',
                'photo_url' => 'https://dummyimage.com/512x512/000/fff',
                'preferred_contact' => 'Email',
                'route' => 'A',
                'visit' => 'N',
                'visit_date_time' => null,
                'total_partial' => 'Partial',
                'cate' => 'Wall',
                'budget' => 'Rp 30.000.000',
                'ownership' => 'Tenant',
                'building_type' => 'Comercial',
                'location' => 'Bekasi',
                'special_req' => '-',
                'request_date' => '2026-06-23',
                'reply_quo' => 'Not Yet',
            ],
            [
                'id' => 3,
                'no' => 98,
                'client_id' => 3,
                'name' => 'Suci',
                'nick_or_company' => 'PT. XXX',
                'photo_url' => 'https://dummyimage.com/512x512/000/fff',
                'preferred_contact' => 'WA',
                'route' => 'D',
                'visit' => 'Y',
                'visit_date_time' => '2026-06-29 14:30',
                'total_partial' => 'Total',
                'cate' => '-',
                'budget' => 'Rp 75.000.000',
                'ownership' => 'Owner',
                'building_type' => 'House',
                'location' => 'Tangerang',
                'special_req' => 'Double-check layouts',
                'request_date' => '2026-06-22',
                'reply_quo' => 'Replied',
            ],
        ];

        foreach ($quotations as $quotation) {
            Quotation::create($quotation);
        }
    }
}
