<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ConvertCamelCaseToSnakeCase
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $request->replace($this->convertKeysToSnakeCase($request->all()));
        return $next($request);
    }

    /**
     * Recursively convert array keys to snake_case.
     *
     * @param  array  $array
     * @return array
     */
    protected function convertKeysToSnakeCase(array $array): array
    {
        $result = [];
        foreach ($array as $key => $value) {
            $newKey = Str::snake($key);
            if (is_array($value)) {
                $value = $this->convertKeysToSnakeCase($value);
            }
            $result[$newKey] = $value;
        }
        return $result;
    }
}
