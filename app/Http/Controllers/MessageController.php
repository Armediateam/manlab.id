<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->role === 'admin') {
            $messages = Message::orderBy('no', 'desc')->get();
        } else {
            $client = Client::where('mail', $user->email)->first();
            $messages = $client ? Message::where('client_id', $client->id)->orderBy('no', 'desc')->get() : collect([]);
        }

        return Inertia::render('message', [
            'messages' => $messages,
        ]);
    }

    protected function autoRegisterClient($name, $nick, $mail)
    {
        if (empty($name)) return null;

        $client = Client::whereRaw('LOWER(name) = ?', [strtolower(trim($name))])->first();
        if (!$client) {
            $client = Client::create([
                'no' => rand(1000, 9999),
                'name' => $name,
                'nick_or_company' => $nick ?: '-',
                'type' => 'Mail',
                'hp_for_wa' => '-',
                'mail' => $mail ?: '-',
                'request_type' => 'Admin Direct',
                'request_quotation' => '0EA',
                'consulting_reply' => '1EA',
            ]);
        }
        return $client->id;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'no' => 'required|integer',
            'manual_auto' => 'required|in:Auto,Manual',
            'format_type' => 'required|in:Greeting,Quotation,Others',
            'name' => 'required|string|max:255',
            'nick' => 'nullable|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'mail' => 'nullable|string|max:255',
            'message_subject' => 'required|string|max:255',
            'request_date_time' => 'required|string',
            'result' => 'required|in:Send Mail Successed,Send Mail Fail',
            'send_time' => 'nullable|string',
        ]);

        $clientId = $this->autoRegisterClient($validated['name'], $validated['nick'], $validated['mail']);
        $validated['client_id'] = $clientId;

        Message::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Message $message)
    {
        $validated = $request->validate([
            'manual_auto' => 'required|in:Auto,Manual',
            'format_type' => 'required|in:Greeting,Quotation,Others',
            'name' => 'required|string|max:255',
            'nick' => 'nullable|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'mail' => 'nullable|string|max:255',
            'message_subject' => 'required|string|max:255',
            'request_date_time' => 'required|string',
            'result' => 'required|in:Send Mail Successed,Send Mail Fail',
            'send_time' => 'nullable|string',
        ]);

        $clientId = $this->autoRegisterClient($validated['name'], $validated['nick'], $validated['mail']);
        $validated['client_id'] = $clientId;

        $message->update($validated);

        return redirect()->back();
    }

    public function destroy(Message $message)
    {
        $message->delete();

        return redirect()->back();
    }
}
