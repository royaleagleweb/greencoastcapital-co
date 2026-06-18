// Cloudflare Pages Function: POST /api/whatsapp
// Sends a WhatsApp message to the site owner on each form submission, via CallMeBot.
// Configure two environment variables in Cloudflare Pages (Settings -> Variables):
//   WA_PHONE  = your WhatsApp number in international format, digits only (e.g. 15551234567)
//   WA_APIKEY = the API key CallMeBot gives you (https://www.callmebot.com/blog/free-api-whatsapp-messages/)
// Until both are set, the function no-ops gracefully and the email notification still works.

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { "Content-Type": "application/json" },
  });
}

function pick(d, keys) {
  for (var i = 0; i < keys.length; i++) {
    if (d[keys[i]] != null && String(d[keys[i]]).trim() !== "") return String(d[keys[i]]).trim();
  }
  return "";
}

function buildMessage(d) {
  var lines = ["New Green Coast Capital lead"];
  var name = pick(d, ["name", "legal_name"]);
  if (!name) {
    var fn = pick(d, ["first_name"]);
    var ln = pick(d, ["last_name"]);
    name = (fn + " " + ln).trim();
  }
  if (name) lines.push("Name: " + name);
  var email = pick(d, ["email"]);
  if (email) lines.push("Email: " + email);
  var phone = pick(d, ["phone"]);
  if (phone) lines.push("Phone: " + phone);
  var business = pick(d, ["business", "legal_name"]);
  if (business && business !== name) lines.push("Business: " + business);
  var amount = pick(d, ["amount", "amount_needed"]);
  if (amount) lines.push("Amount: " + amount);
  var industry = pick(d, ["industry"]);
  if (industry) lines.push("Industry: " + industry);
  var rev = pick(d, ["monthly_revenue", "revenue"]);
  if (rev) lines.push("Monthly revenue: " + rev);
  var tib = pick(d, ["time_in_business"]);
  if (tib) lines.push("Time in business: " + tib);
  var soon = pick(d, ["how_soon"]);
  if (soon) lines.push("Needs funds: " + soon);
  var purpose = pick(d, ["purpose"]);
  if (purpose) lines.push("Purpose: " + purpose);
  var subject = pick(d, ["subject"]);
  if (subject) lines.push("Subject: " + subject);
  var message = pick(d, ["message"]);
  if (message) lines.push("Message: " + message);
  lines.push("-- greencoastcapital.co");
  return lines.join("\n");
}

export async function onRequestPost(context) {
  var env = context.env || {};
  try {
    var data = await context.request.json();
    var phone = env.WA_PHONE;
    var apikey = env.WA_APIKEY;
    if (!phone || !apikey) {
      return json({ ok: false, reason: "not_configured" });
    }
    var text = buildMessage(data);
    var url =
      "https://api.callmebot.com/whatsapp.php?phone=" +
      encodeURIComponent(phone) +
      "&text=" +
      encodeURIComponent(text) +
      "&apikey=" +
      encodeURIComponent(apikey);
    var r = await fetch(url, { method: "GET" });
    return json({ ok: r.ok });
  } catch (e) {
    return json({ ok: false, reason: "error" });
  }
}

// Health check
export async function onRequestGet() {
  return json({ ok: true, service: "whatsapp-notify" });
}
