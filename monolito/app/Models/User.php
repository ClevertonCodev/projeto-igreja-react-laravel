<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\ResetPasswordNotification;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements JWTSubject, MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nome',
        'rg',
        'cpf',
        'telefone',
        'endereco',
        'ativo',
        'tipo',
        'email',
        'password',
        'ala_id'
    ];

    public function alas() {
        return $this->belongsTo(Alas::class);
    }

    public function caravanas()
    {
        return $this->belongsToMany(Caravanas::class, CaravanasParticipante::class, 'caravana_id', 'user_id')->withPivot('funcao', 'status', 'data_confirmacao');
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        // 'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [
                'nome'  => $this->nome,
                'tipo'  => $this->tipo,
                'email' => $this->email_verified_at
               ];
    }

    public function sendPasswordResetNotification($token)
    {
        $url = 'http://localhost:8000/reset-password?token=' . $token;
        $this->notify(new ResetPasswordNotification($url));
    }

}