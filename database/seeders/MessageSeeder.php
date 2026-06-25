<?php

namespace Database\Seeders;

use App\Models\Message;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $messages = [
            [
                'id' => 1,
                'no' => 100,
                'client_id' => 1,
                'manual_auto' => 'Auto',
                'format_type' => 'Greeting',
                'name' => 'Chung',
                'nick' => 'Chung',
                'company_name' => 'Mandor Lab',
                'mail' => 'chung@manlab.id',
                'message_subject' => 'Welcome Message',
                'request_date_time' => '2026-06-24 08:30',
                'result' => 'Send Mail Successed',
                'send_time' => '2026-06-24 08:31',
            ],
            [
                'id' => 2,
                'no' => 99,
                'client_id' => 2,
                'manual_auto' => 'Manual',
                'format_type' => 'Quotation',
                'name' => 'Reiza',
                'nick' => 'Rei',
                'company_name' => 'Hansung',
                'mail' => 'reiza@hansung.com',
                'message_subject' => 'Quotation Message',
                'request_date_time' => '2026-06-24 10:15',
                'result' => 'Send Mail Successed',
                'send_time' => '2026-06-24 10:22',
            ],
            [
                'id' => 3,
                'no' => 98,
                'client_id' => 3,
                'manual_auto' => 'Auto',
                'format_type' => 'Quotation',
                'name' => 'Suci',
                'nick' => 'Suci',
                'company_name' => 'PT. XXX',
                'mail' => 'suci@ptxxx.co.id',
                'message_subject' => 'Auto Request Quotation',
                'request_date_time' => '2026-06-23 14:10',
                'result' => 'Send Mail Fail',
                'send_time' => '2026-06-23 14:11',
            ],
            [
                'id' => 4,
                'no' => 97,
                'client_id' => 4,
                'manual_auto' => 'Manual',
                'format_type' => 'Others',
                'name' => 'Dwikky',
                'nick' => 'Dwik',
                'company_name' => 'Dongyang',
                'mail' => 'dwikky@dongyang.com',
                'message_subject' => 'Follow Up Interior Schedule',
                'request_date_time' => '2026-06-22 16:45',
                'result' => 'Send Mail Successed',
                'send_time' => '2026-06-22 16:47',
            ],
        ];

        foreach ($messages as $message) {
            Message::create($message);
        }
    }
}
