<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clients = [
            [
                'id' => 1,
                'no' => 100,
                'name' => 'Chung',
                'nick_or_company' => '',
                'type' => 'WA/Mail',
                'hp_for_wa' => '010-0000-0000',
                'mail' => 'chung@manlab.id',
                'request_type' => 'Admin Direct',
                'request_quotation' => '1EA',
                'consulting_reply' => '3EA',
                'withdrawal' => null,
            ],
            [
                'id' => 2,
                'no' => 99,
                'name' => 'Reiza',
                'nick_or_company' => 'Hansung',
                'type' => 'Mail',
                'hp_for_wa' => '-',
                'mail' => 'reiza@hansung.com',
                'request_type' => 'Request Consulting(AUTO)',
                'request_quotation' => '1EA',
                'consulting_reply' => '1EA',
                'withdrawal' => null,
            ],
            [
                'id' => 3,
                'no' => 98,
                'name' => 'Suci',
                'nick_or_company' => 'PT.XXX',
                'type' => 'WA',
                'hp_for_wa' => '010-0000-0000',
                'mail' => 'suci@ptxxx.co.id',
                'request_type' => 'Admin Direct',
                'request_quotation' => '2EA',
                'consulting_reply' => '2EA',
                'withdrawal' => null,
            ],
            [
                'id' => 4,
                'no' => 97,
                'name' => 'Dwikky',
                'nick_or_company' => 'Dongyang',
                'type' => 'WA/Mail',
                'hp_for_wa' => '010-0000-0000',
                'mail' => 'dwikky@dongyang.com',
                'request_type' => 'Request Consulting(AUTO)',
                'request_quotation' => '1EA',
                'consulting_reply' => '0EA',
                'withdrawal' => '2023-00-00 00:00:00',
            ],
            [
                'id' => 5,
                'no' => 96,
                'name' => 'Henry',
                'nick_or_company' => 'Apollo',
                'type' => 'WA',
                'hp_for_wa' => '010-0000-0000',
                'mail' => 'henry@apollo.com',
                'request_type' => 'Admin Direct',
                'request_quotation' => '1EA',
                'consulting_reply' => '0EA',
                'withdrawal' => null,
            ],
        ];

        foreach ($clients as $client) {
            Client::create($client);
        }
    }
}
