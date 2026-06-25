<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Quotation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuotationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->role === 'admin') {
            $quotations = Quotation::orderBy('no', 'desc')->get();
            $clients = Client::orderBy('name', 'asc')->get();
        } else {
            $client = Client::where('mail', $user->email)->first();
            $quotations = $client ? Quotation::where('client_id', $client->id)->orderBy('no', 'desc')->get() : collect([]);
            $clients = $client ? Client::where('id', $client->id)->get() : collect([]);
        }

        return Inertia::render('quotation', [
            'quotations' => $quotations,
            'clients' => $clients,
        ]);
    }

    protected function autoRegisterClient($name, $nickOrCompany, $preferredContact)
    {
        if (empty($name)) return null;

        $client = Client::whereRaw('LOWER(name) = ?', [strtolower(trim($name))])->first();
        if (!$client) {
            $client = Client::create([
                'no' => rand(1000, 9999),
                'name' => $name,
                'nick_or_company' => $nickOrCompany ?: '-',
                'type' => $preferredContact === 'Email' ? 'Mail' : 'WA',
                'hp_for_wa' => '-',
                'mail' => '-',
                'request_type' => 'Admin Direct',
                'request_quotation' => '1EA',
                'consulting_reply' => '0EA',
            ]);
        }
        return $client->id;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'no' => 'required|integer',
            'name' => 'required|string|max:255',
            'nick_or_company' => 'nullable|string|max:255',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'photo_url' => 'nullable',
            'preferred_contact' => 'required|in:WA,Email',
            'route' => 'required|in:D,A',
            'visit' => 'required|in:N,Y',
            'visit_date_time' => 'nullable|string',
            'total_partial' => 'required|in:Total,Partial',
            'cate' => 'required|string|max:255',
            'budget' => 'required|string|max:255',
            'ownership' => 'required|in:Owner,Tenant',
            'building_type' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'special_req' => 'nullable|string',
            'request_date' => 'required|string',
            'reply_quo' => 'required|in:Replied,Not Yet',
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('quotations', 'public');
            $validated['photo_url'] = '/storage/' . $path;
        }

        $clientId = $this->autoRegisterClient($validated['name'], $validated['nick_or_company'], $validated['preferred_contact']);
        $validated['client_id'] = $clientId;

        Quotation::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Quotation $quotation)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nick_or_company' => 'nullable|string|max:255',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'photo_url' => 'nullable',
            'preferred_contact' => 'required|in:WA,Email',
            'route' => 'required|in:D,A',
            'visit' => 'required|in:N,Y',
            'visit_date_time' => 'nullable|string',
            'total_partial' => 'required|in:Total,Partial',
            'cate' => 'required|string|max:255',
            'budget' => 'required|string|max:255',
            'ownership' => 'required|in:Owner,Tenant',
            'building_type' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'special_req' => 'nullable|string',
            'request_date' => 'required|string',
            'reply_quo' => 'required|in:Replied,Not Yet',
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('quotations', 'public');
            $validated['photo_url'] = '/storage/' . $path;
        }

        $clientId = $this->autoRegisterClient($validated['name'], $validated['nick_or_company'], $validated['preferred_contact']);
        $validated['client_id'] = $clientId;

        $quotation->update($validated);

        return redirect()->back();
    }

    public function destroy(Quotation $quotation)
    {
        $quotation->delete();

        return redirect()->back();
    }
}
