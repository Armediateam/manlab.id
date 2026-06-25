<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->role === 'admin') {
            $clients = Client::orderBy('no', 'desc')->get();
        } else {
            $clients = Client::where('mail', $user->email)->orderBy('no', 'desc')->get();
        }

        return Inertia::render('client', [
            'clients' => $clients,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'no' => 'required|integer',
            'name' => 'required|string|max:255',
            'nick_or_company' => 'nullable|string|max:255',
            'type' => 'required|in:WA,Mail,WA/Mail',
            'hp_for_wa' => 'nullable|string|max:255',
            'mail' => 'nullable|string|max:255',
            'request_type' => 'nullable|string|max:255',
            'request_quotation' => 'nullable|string|max:255',
            'consulting_reply' => 'nullable|string|max:255',
            'withdrawal' => 'nullable|string|max:255',
        ]);

        Client::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nick_or_company' => 'nullable|string|max:255',
            'type' => 'required|in:WA,Mail,WA/Mail',
            'hp_for_wa' => 'nullable|string|max:255',
            'mail' => 'nullable|string|max:255',
            'request_type' => 'nullable|string|max:255',
            'request_quotation' => 'nullable|string|max:255',
            'consulting_reply' => 'nullable|string|max:255',
            'withdrawal' => 'nullable|string|max:255',
        ]);

        $client->update($validated);

        return redirect()->back();
    }

    public function destroy(Client $client)
    {
        $client->delete();

        return redirect()->back();
    }
}
