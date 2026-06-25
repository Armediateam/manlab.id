<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->role === 'admin') {
            $reviews = Review::orderBy('id', 'desc')->get();
        } else {
            $client = Client::where('mail', $user->email)->first();
            $reviews = $client ? Review::where('client_id', $client->id)->orderBy('id', 'desc')->get() : collect([]);
        }

        return Inertia::render('review', [
            'reviews' => $reviews,
        ]);
    }

    protected function autoRegisterClient($name, $nickOrCompany, $email)
    {
        if (empty($name)) return null;

        $client = Client::whereRaw('LOWER(name) = ?', [strtolower(trim($name))])->first();
        if (!$client) {
            $client = Client::create([
                'no' => rand(1000, 9999),
                'name' => $name,
                'nick_or_company' => $nickOrCompany ?: '-',
                'type' => 'Mail',
                'hp_for_wa' => '-',
                'mail' => $email ?: '-',
                'request_type' => 'Admin Direct',
                'request_quotation' => '0EA',
                'consulting_reply' => '0EA',
            ]);
        }
        return $client->id;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nick_or_company' => 'nullable|string|max:255',
            'email' => 'nullable|string|max:255',
            'selected' => 'required|boolean',
            'top8' => 'required|boolean',
            'thumbnail_before_file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'thumbnail_after_file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'thumbnail_before' => 'nullable',
            'thumbnail_after' => 'nullable',
            'register_start_date' => 'required|string',
            'register_end_date' => 'required|string',
            'category' => 'required|string|max:255',
            'selected_vendor' => 'required|string|max:255',
            'like' => 'nullable|integer',
            'view_status' => 'required|in:Viewing,Hidden',
            'notes' => 'nullable|string',
        ]);

        if ($request->hasFile('thumbnail_before_file')) {
            $path = $request->file('thumbnail_before_file')->store('reviews', 'public');
            $validated['thumbnail_before'] = '/storage/' . $path;
        }
        if ($request->hasFile('thumbnail_after_file')) {
            $path = $request->file('thumbnail_after_file')->store('reviews', 'public');
            $validated['thumbnail_after'] = '/storage/' . $path;
        }

        $clientId = $this->autoRegisterClient($validated['name'], $validated['nick_or_company'], $validated['email']);
        $validated['client_id'] = $clientId;

        Review::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Review $review)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nick_or_company' => 'nullable|string|max:255',
            'email' => 'nullable|string|max:255',
            'selected' => 'required|boolean',
            'top8' => 'required|boolean',
            'thumbnail_before_file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'thumbnail_after_file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'thumbnail_before' => 'nullable',
            'thumbnail_after' => 'nullable',
            'register_start_date' => 'required|string',
            'register_end_date' => 'required|string',
            'category' => 'required|string|max:255',
            'selected_vendor' => 'required|string|max:255',
            'like' => 'nullable|integer',
            'view_status' => 'required|in:Viewing,Hidden',
            'notes' => 'nullable|string',
        ]);

        if ($request->hasFile('thumbnail_before_file')) {
            $path = $request->file('thumbnail_before_file')->store('reviews', 'public');
            $validated['thumbnail_before'] = '/storage/' . $path;
        }
        if ($request->hasFile('thumbnail_after_file')) {
            $path = $request->file('thumbnail_after_file')->store('reviews', 'public');
            $validated['thumbnail_after'] = '/storage/' . $path;
        }

        $clientId = $this->autoRegisterClient($validated['name'], $validated['nick_or_company'], $validated['email']);
        $validated['client_id'] = $clientId;

        $review->update($validated);

        return redirect()->back();
    }

    public function destroy(Review $review)
    {
        $review->delete();

        return redirect()->back();
    }
}
