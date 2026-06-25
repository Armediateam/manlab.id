<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\CamelCaseModel;

class Message extends Model
{
    use CamelCaseModel;

    protected $fillable = [
        'no',
        'client_id',
        'manual_auto',
        'format_type',
        'name',
        'nick',
        'company_name',
        'mail',
        'message_subject',
        'request_date_time',
        'result',
        'send_time',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
