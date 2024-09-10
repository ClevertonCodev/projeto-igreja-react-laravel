<?php

namespace App\Http\Middleware;

use Closure;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Gate;

class CheckVerifyAuthorization
{
    /**
     * Handle an incoming request.
     * @param \Illuminate\Http\Request $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle($request, Closure $next): Response
    {
        $id   = $this->getId($request);

        if ($this->shouldInclude($request)) {
            if (!Gate::allows('verifyAuthorization', $id)) {
                return response()->json(['error' => 'Usuário não autorizado.'], Response::HTTP_FORBIDDEN);
            }
        }

        return $next($request);
    }

    private function shouldInclude($request)
    {
        $id = $this->getId($request);

        $includedRoutes = [
            "api/v1/user/remover/{$id}",
            "api/v1/user/cadastro/admin",
            "api/v1/user/detalhes/{$id}"
        ];

        return in_array($request->path(), $includedRoutes);
    }

    private function getId($request)
    {
        $pathInfo = $request->getPathInfo();
        $segments = explode('/', trim($pathInfo, '/'));
        $id = end($segments);
        return intval($id);
    }
}
