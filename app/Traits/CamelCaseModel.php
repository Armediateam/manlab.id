<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait CamelCaseModel
{
    /**
     * Convert the model instance to an array.
     *
     * @return array
     */
    public function toArray()
    {
        $array = parent::toArray();
        return $this->convertKeysToCamelCase($array);
    }

    /**
     * Recursively convert array keys to camelCase.
     *
     * @param  array  $array
     * @return array
     */
    protected function convertKeysToCamelCase(array $array): array
    {
        $result = [];
        foreach ($array as $key => $value) {
            $newKey = Str::camel($key);
            if (is_array($value)) {
                $value = $this->convertKeysToCamelCase($value);
            }
            $result[$newKey] = $value;
        }
        return $result;
    }
}
