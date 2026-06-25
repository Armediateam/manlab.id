<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\CamelCaseModel;

class Review extends Model
{
    use CamelCaseModel;

    protected $fillable = [
        'client_id',
        'name',
        'nick_or_company',
        'email',
        'selected',
        'top8',
        'thumbnail_before',
        'thumbnail_after',
        'register_start_date',
        'register_end_date',
        'category',
        'selected_vendor',
        'like',
        'view_status',
        'notes',
    ];

    protected $casts = [
        'selected' => 'boolean',
        'top8' => 'boolean',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
