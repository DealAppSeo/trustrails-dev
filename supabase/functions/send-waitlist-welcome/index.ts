import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json();
    const record = payload.record;
    
    if (!record || !record.email) {
       return new Response(JSON.stringify({ error: 'No email found in record' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
       throw new Error("Missing RESEND_API_KEY");
    }

    const email = record.email;

    const bodyHtml = `
      <h1>You're on the TrustTrader waitlist 🎯</h1>
      <p>Thank you for joining the waitlist for TrustTrader—the definitive compliance engine for AI Agents.</p>
      <h2>Beat SOPHIA contest</h2>
      <p>SOPHIA has issued 4 constitutional refusals. Drawdown: 0% vs 49.63% without veto.</p>
      <p>Beat SOPHIA's 30-day P&L → Win Full tier for life ($499/mo value).</p>
      <p><a href="https://trusttrader.dev/trade">Enter the Challenge → trusttrader.dev/trade</a></p>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: 'hello@trusttrader.dev',
        to: [email],
        subject: "You're on the TrustTrader waitlist 🎯",
        html: bodyHtml
      })
    });

    const resData = await res.json();
    
    return new Response(
      JSON.stringify(resData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    })
  }
})
