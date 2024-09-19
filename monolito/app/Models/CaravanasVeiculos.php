<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;

class CaravanasVeiculos extends Model
{
    use HasFactory;

    protected $fillable = ['caravana_id', 'veiculo_id'];

}