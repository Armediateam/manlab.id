<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\CamelCaseModel;

class Quotation extends Model
{
    use CamelCaseModel;

    protected $fillable = [
        'no',
        'client_id',
        'name',
        'nick_or_company',
        'photo_url',
        'preferred_contact',
        'route',
        'visit',
        'visit_date_time',
        'total_partial',
        'cate',
        'budget',
        'ownership',
        'building_type',
        'location',
        'special_req',
        'request_date',
        'reply_quo',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
