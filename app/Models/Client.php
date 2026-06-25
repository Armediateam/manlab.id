<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\CamelCaseModel;

class Client extends Model
{
    use CamelCaseModel;

    protected $fillable = [
        'no',
        'name',
        'nick_or_company',
        'type',
        'hp_for_wa',
        'mail',
        'request_type',
        'request_quotation',
        'consulting_reply',
        'withdrawal',
    ];

    public function quotations()
    {
        return $this->hasMany(Quotation::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
