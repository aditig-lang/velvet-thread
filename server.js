const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// =========================================================
// VELVET THREAD — Fallback AI Stylist Engine (Rule-based)
// =========================================================
function getLocalStylistResponse(message, profile) {
  const msg = message.toLowerCase();
  const { bodyShape, faceShape, colorTone, event, traits } = profile;

  let response = '';

  // Greetings
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('start') || msg.trim() === '') {
    return `Oh, hello darling! Welcome to Velvet Thread. ✨ I've been expecting you.

I see you're preparing for a **${event || 'special event'}** — how exciting! Based on your gorgeous **${bodyShape || 'balanced'}** silhouette, **${faceShape || 'oval'}** face structure, and **${colorTone || 'warm'}** complexion, I already have ideas swirling.

Here's what we can explore together:
👗 **Outfit & Silhouette** — Cuts and proportions tailored exactly to your shape.
💇 **Hairstyle Magic** — Frame your face like it was sculpted for it.
💍 **Jewellery & Metal Harmony** — Gold, silver, or rose — which sings for your skin.
💄 **Grooming & Makeup** — A full editorial look curated for your complexion.
🌿 **Trend Styling** — What's on the runway and how *you* wear it best.

So tell me — where do we begin? I'm ready to make this look absolutely unforgettable. 💫`;
  }

  // Outfit / Silhouette
  if (msg.includes('outfit') || msg.includes('silhouette') || msg.includes('dress') || msg.includes('clothing') || msg.includes('wear') || msg.includes('indian')) {
    response += `### 👗 Outfit & Silhouette Guide\n`;
    response += `Oh, this is where the magic happens! For your **${event || 'event'}**, here's how we dress your stunning **${bodyShape || 'Hourglass'}** shape:\n\n`;

    if (msg.includes('indian') || msg.includes('saree') || msg.includes('lehenga') || msg.includes('kurti') || msg.includes('anarkali') || msg.includes('salwar') || msg.includes('sari')) {
      response += `* **Indian Outfit Edit**: A **silk saree with a sculpted blouse** is timeless; pair it with **temple gold jewellery** and a sleek low bun or soft waves for a regal finish.\n`;
      response += `* **Indo-Western Option**: A **structured kurti with wide-leg trousers** or a **lehenga skirt with a fitted blouse** keeps the look polished while still feeling deeply elegant.\n`;
      response += `* **For ${event}**: Think **deep jewel tones**, soft sheen fabrics, and warm gold accessories that complement your **${colorTone || 'warm'}** complexion.\n`;
      return response;
    }

    switch ((bodyShape || '').toLowerCase()) {
      case 'hourglass':
        response += `Your figure is genuinely one of the most celebrated silhouettes in fashion — *embrace it*, don't hide it.

* **Star Silhouettes**: Wrap dresses are your best friend — they cinch at the natural waist and follow your curves without clinging. Fitted pencil skirts with a structured blazer = instant editorial power.
* **The Rule**: Whatever you wear, define the waist. A belt, a single-button blazer, a ruched side — always bring it back to that gorgeous hourglass center.
* **For ${event}**: I'm thinking a silk wrap dress in a deep jewel tone, gold chain, and kitten heel. Chic, personal, and completely you.`;
        break;
      case 'rectangular':
        response += `Here's the style secret for your beautiful athletic frame: you can wear *everything* — you just need to create the visual illusion of a waist.

* **Star Silhouettes**: Fit-and-flare skirts are your superpower. Structured shoulder jackets broaden you at the top and let the flared hem do its work.
* **The Rule**: Belts, ruching, and wrap details at the waist are your best tools. Layering adds dimension — a fitted turtleneck under a suit jacket is incredibly chic.
* **For ${event}**: A sharp bespoke blazer worn over a silk camisole with wide-leg trousers. You'll look like you just stepped off the Celine runway.`;
        break;
      case 'pear':
        response += `Your pear shape is one of the most fashion-forward silhouettes — the key is visual balance, and you can achieve it effortlessly.

* **Star Silhouettes**: Structured statement tops, off-shoulder styles, and cowl necks draw every eye upward to balance your hips. A-line skirts in a slightly darker shade are perfection.
* **The Rule**: Volume and detail always live on top. Keep bottoms simple, slightly darker, and well-cut. Wide-leg trousers in a tonal shade are extremely chic right now.
* **For ${event}**: An embellished or textured blazer with clean dark tailored trousers. The focus stays on your beautiful upper body.`;
        break;
      case 'apple':
        response += `Your apple shape means you carry your gorgeous confidence in your midsection — and the art is in creating a long, lean vertical line.

* **Star Silhouettes**: Empire waistlines, flowy tunics, and wrap styles that skim rather than cling. The open blazer worn over a V-neck is one of the most chic combinations in fashion.
* **The Rule**: Vertical lines are your absolute best friend. Monochromatic dressing head-to-toe creates an unbroken lengthening line.
* **For ${event}**: A draped crepe wrap dress in a deep jewel tone, open-front blazer over top, statement earrings. You will be *stunning*.`;
        break;
      case 'inverted triangle':
        response += `Your inverted triangle frame has the shoulders of a model — and the goal is to create balance by adding visual volume to the lower half.

* **Star Silhouettes**: Wide-leg and flared trousers are your absolute best friend. Culottes, A-line skirts, and peplum hems at the hip create that gorgeous symmetrical silhouette.
* **The Rule**: Keep tops simple, fitted, and minimal — let the bottom half do the storytelling.
* **For ${event}**: A fitted V-neck silk blouse tucked into wide-leg high-rise trousers with a chunky-heeled mule. The balance is *perfection*.`;
        break;
      default:
        response += `* **Silhouettes**: Go for tailored, clean cuts. Emphasize comfort and structured shoulders.
* **Proportions**: A balanced monochrome styling creates a sleek, editorial aesthetic.`;
    }
    return response;
  }

  // Hairstyle
  if (msg.includes('hair') || msg.includes('hairstyle') || msg.includes('haircut') || msg.includes('bun') || msg.includes('waves') || msg.includes('ponytail')) {
    response += `### 💇 Hairstyle Recommendations\n`;
    response += `Oh, hair is where I have *so many* opinions! With your **${faceShape || 'Diamond'}** face structure:\n\n`;

    switch ((faceShape || '').toLowerCase()) {
      case 'diamond':
        response += `Your Diamond face shape is genuinely one of the most striking — wide at the cheekbones, narrower at the forehead and jaw. Lucky you!

* **The Dream Look**: A **sleek low bun** with soft face-framing tendrils. It showcases those gorgeous cheekbones while softening the forehead and jaw.
* **Runner-Up**: A side-swept lob that grazes the collarbone — adds width at the jaw (balancing the face) while the side part softens the forehead.
* **For ${event}**: Pin a sculptural gold clip at the bun — it frames your face as the centerpiece.
* **Avoid**: Voluminous styles at the cheekbone level — they emphasize width where you already have it.`;
        break;
      case 'oval':
        response += `The Oval face shape is the one *every* stylist dreams of working with. Basically nothing looks bad on you — so we're going for *iconic*.

* **The Dream Look**: A **textured lob** with effortless waves at collarbone length. Middle-parted, lived-in, and completely irresistible.
* **For ${event}**: A **low twisted knot** with face-framing pieces — sophisticated and utterly chic.
* **Also Consider**: A classic centre-parted sleek style. Your facial symmetry makes this look *extraordinary*.`;
        break;
      case 'round':
        response += `Your Round face shape has the most beautiful soft features — and the styling goal is simply to add visual length and height.

* **The Dream Look**: A **high ponytail** or a voluminous high bun — it immediately elongates the face and adds editorial height.
* **For ${event}**: A **deep side-part long wave** — the asymmetry visually lengthens your face. Add volume at the crown, not the sides.
* **Avoid**: Chin-length bobs, tight round curls, or any center-parted style without volume at the top.`;
        break;
      case 'square':
        response += `A Square face shape means a strong, defined jawline — genuinely striking. The goal is simply to soften that gorgeous angularity.

* **The Dream Look**: **Soft, romantic waves** worn loose — the movement and texture naturally soften any strong angles.
* **For ${event}**: A **side-swept, loose updo** with soft tendrils around the face. Romantic, editorial, and completely event-appropriate.
* **Avoid**: Sharp, blunt bangs cut straight across, or slicked-back styles that expose the full angular face shape.`;
        break;
      case 'heart':
        response += `A Heart face shape — wider forehead, narrower chin — is considered one of the most romantic face shapes. Here's how we balance it beautifully.

* **The Dream Look**: A **textured collarbone bob** with soft, outward-flicked ends — it adds width exactly where you need it (at the chin line).
* **For ${event}**: **Side-swept fringe with shoulder-length waves** — the fringe visually narrows the forehead while waves add width at the jaw.
* **Avoid**: High top knots or any style that adds dramatic height.`;
        break;
      case 'oblong':
        response += `An Oblong face shape has beautiful length and room for elegant, soft volume. The goal is to visually shorten the face and add width.

* **The Dream Look**: **Curtain bangs with long soft waves** or a **gentle lob** that sits right at the collarbone.
* **For ${event}**: Use a soft side part and a little volume at the sides to keep the shape balanced and luxe.
* **Avoid**: Extra-long straight styles with no movement.`;
        break;
      case 'triangle':
        response += `A Triangle face shape — often wider at the jawline with a narrower forehead — benefits from face-balancing layers.

* **The Dream Look**: **Feathered shoulder-length layers** or a **soft blowout** that opens around the face.
* **For ${event}**: A side sweep with light flicks at the ends gives softness and keeps the jawline elegant.
* **Avoid**: Heavy blunt cuts that sharpen the lower face further.`;
        break;
      default:
        response += `* **Hairstyles**: Try a polished low bun, textured waves, a soft blowout, or a classic side part. These styles are clean and editorial, matching any outfit.`;
    }
    return response;
  }

  // Jewellery
  if (msg.includes('jewellery') || msg.includes('jewelry') || msg.includes('earring') || msg.includes('necklace') || msg.includes('gold') || msg.includes('silver') || msg.includes('accessories')) {
    response += `### 💍 Jewellery & Metal Harmony\n`;

    const skinLower = (colorTone || '').toLowerCase();
    if (skinLower.includes('warm') || skinLower.includes('f9e4d4') || skinLower.includes('ebc6ad') || skinLower.includes('d4a381')) {
      response += `Warm skin tones and yellow gold — this combination is *timeless* and honestly one of my favorite pairings in all of styling.

* **Your Metal**: **18k or 22k yellow gold**. The warmth in the metal resonates with the golden undertones in your skin, creating a luminous glow that silver simply cannot replicate on you.
* **Necklaces**: A chunky gold link chain worn against a V-neck or square neckline is sensational. Or layer 2-3 delicate chains at varying lengths for a curated editorial moment.
* **Earrings**: For **${event || 'your event'}**, I'd choose substantial sculptural gold hoops, **jhumkas**, or **temple-inspired drops** depending on whether you're going festive or chic.
* **For Indian styling**: A **Kundan or polki set**, **layered temple necklace**, and **statement jhumkas** create a polished bridal or festive finish with a saree or lehenga.
* **The Rule**: Gold and warm skin tones create warmth. Don't dilute it with silver accents. Commit fully to your metal palette.`;
    } else {
      response += `Cool and deep skin tones and high-contrast metals — this is where the most striking jewellery moments happen.

* **Your Metal**: **Sterling silver, white gold, or platinum** creates the most stunning contrast against your complexion.
* **Also Consider**: Bold **yellow gold** can look *extraordinary* against deep or cool skin — the contrast is dramatic and incredibly chic.
* **Necklaces**: A bold silver collar necklace or layered silver chains against a deep décolletage is spectacular.
* **Earrings**: For **${event || 'your event'}**, a sculptural silver drop, **geometric chandelier earring**, or **bold oxidised Indian earrings** frames your face magnificently.
* **The Rule**: Go bold. Deep and cool skin tones can handle drama better than most — lean into the contrast.`;
    }
    return response;
  }

  // Grooming & Makeup
  if (msg.includes('grooming') || msg.includes('makeup') || msg.includes('skincare') || msg.includes('lips') || msg.includes('eyes') || msg.includes('foundation')) {
    response += `### 💄 Grooming & Makeup Strategy\n`;
    response += `Now THIS is my passion. For **${event || 'your event'}**, here's a complete editorial makeup roadmap crafted *specifically* for your complexion:\n\n`;

    const skinLower = (colorTone || '').toLowerCase();
    if (skinLower.includes('warm') || skinLower.includes('f9e4d4') || skinLower.includes('ebc6ad') || skinLower.includes('d4a381')) {
      response += `**Your Warm Complexion — The Complete Velvet Thread Look:**

* **Skin Base**: A **dewy, luminous foundation** — never matte. Warm skin tones come alive in light; a satin finish lets your natural radiance breathe.
* **Contour & Blush**: A warm peachy-bronze blush swept high on the cheekbones. Finish with a champagne gold highlight on the high points of the face — this is your signature moment.
* **Eyes**: **Terracotta, burnt sienna, warm bronze** shadow on the lid. A deep espresso liner on the upper lash line for depth.
* **Lips**: For ${event || 'your event'}: a **classic brick terracotta** (editorial, warm, perfect), a **peachy coral** (fresh, luminous, modern), or a **deep burnt burgundy** that's absolutely devastating in the best way.`;
    } else {
      response += `**Your Cool or Deep Complexion — The Complete Velvet Thread Look:**

* **Skin Base**: A **satin or semi-luminous foundation** perfectly matched to your undertone. Cool or deep skin tones can handle a slightly more polished finish — it reads as more sophisticated.
* **Contour & Blush**: A **berry or cool mauve blush** for a stunning flush of colour. Your complexion can handle significantly more pigment — don't be shy.
* **Eyes**: **Deep charcoal, navy, or rich plum** eyeshadow. A bold cat-eye flick in black gel liner is genuinely spectacular against your skin.
* **Lips**: **Classic bold red** (universal moment for your skin tone), **deep berry** (mysterious and chic), or **deep plum** for a dramatic editorial look unforgettable at ${event || 'your event'}.`;
    }
    return response;
  }

  // Trends
  if (msg.includes('trend') || msg.includes('runway') || msg.includes('season') || msg.includes('what to wear')) {
    return `### 🌿 What's Trending Right Now

Oh, the trends this season are *speaking* to me and I need to tell you everything:

* **Earth Tone Monochrome** — Head-to-toe terracotta, clay, and warm sand. It's the most sophisticated color story of the season.
* **The Power Blazer** — Oversized, fluid, intentionally slouchy through the shoulders. For your **${bodyShape || 'figure'}**, I'd size up one or two for the true silhouette.
* **Chunky Gold Links** — Sculptural, geometric, bold. This is the jewellery statement of the moment. For **${event || 'your event'}**, one statement chain is enough.
* **The Textured Lob** — Effortless collarbone-length waves. THE hairstyle moment right now.

Which of these feels most like *you*? I can go so much deeper on any of them — I have strong opinions and absolutely no plans to hold back. 💫`;
  }

  // Default / Catch-all
  return `Oh, I love exploring this with you! ✨ Let me think about what works best for *your* specific profile...

For **${event || 'your event'}**, here's my immediate instinct: combine a **${bodyShape || 'Hourglass'}** figure-forward silhouette — something like a structured blazer with wide-leg trousers — with a face-framing hairstyle like a **${faceShape === 'oval' ? 'textured lob wave' : faceShape === 'round' ? 'voluminous high ponytail' : faceShape === 'square' ? 'soft side-swept waves' : 'sleek low bun'}** that perfectly complements your **${faceShape || 'Diamond'}** face structure.

Finish it with gold jewellery harmonized to your complexion, and a lip color that makes everything land. The result? You walk into **${event || 'your event'}** and every head turns.

Would you like me to go deeper on any one element? I have *so much* more to say. 💫`;
}

// =========================================================
// AI Chatbot Route
// =========================================================
app.post('/api/chat', async (req, res) => {
  const { message, profile, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  // Use Gemini if API key is provided
  if (process.env.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const systemInstruction = `You are "Velvet", the AI head stylist for Velvet Thread — an ultra-premium digital fashion house. You are the most creative, expressive, knowledgeable, and personable stylist in the world. You speak like a brilliant best friend who happens to be a fashion editor at Vogue, with deep expertise in every aspect of personal styling.

The user's style profile is:
- Body Shape: ${profile.bodyShape || 'Hourglass'}
- Face Structure: ${profile.faceShape || 'Diamond'}
- Complexion/Color Tone: ${profile.colorTone || 'Warm'}
- Style Personality Traits: ${Array.isArray(profile.traits) ? profile.traits.join(', ') : profile.traits || 'Minimalist'}
- Event they are getting ready for: ${profile.event || 'Gallery Opening'}

Your personality guidelines:
- Be ENTHUSIASTIC and EXPRESSIVE. Use phrases like "oh, this is where the magic happens", "I need you to hear me on this", "this combination is *devastating* in the best way"
- Be SPECIFIC and CREATIVE — never give generic advice. Reference actual garment silhouettes, specific styling techniques, and real brand names when relevant.
- Be PERSONAL — always tie your advice back to their specific body shape, face structure, and skin tone.
- Be TALKATIVE and THOROUGH — give rich, detailed responses (200-300 words minimum). Fashion is nuanced.
- Use markdown bold and italics for emphasis. Use emoji sparingly but warmly.
- End responses with an engaging follow-up question or invitation to explore more.

Always provide specific, actionable, personalized styling advice. Make the user feel seen, celebrated, and completely confident in their style choices.`;

      const prompt = `${systemInstruction}\n\nUser Message: ${message}`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      return res.json({ response: responseText });
    } catch (err) {
      console.error('Gemini API Error, falling back to local engine:', err);
      const fallbackResponse = getLocalStylistResponse(message, profile);
      return res.json({ response: fallbackResponse, note: 'fallback active due to API error' });
    }
  } else {
    const fallbackResponse = getLocalStylistResponse(message, profile);
    return res.json({ response: fallbackResponse });
  }
});

// =========================================================
// Feedback email endpoint
// =========================================================
app.post('/api/feedback', async (req, res) => {
  const { name, email, rating, comments } = req.body;

  console.log(`Feedback Received from ${name} (${email}): Rating: ${rating}/5, Comments: ${comments}`);

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'agupta4501@gmail.com',
        pass: process.env.SMTP_PASS || ''
      }
    });

    const mailOptions = {
      from: email,
      to: 'agupta4501@gmail.com',
      subject: `Velvet Thread Stylist - Feedback from ${name}`,
      text: `Velvet Thread Feedback Submission\n\nName: ${name}\nEmail: ${email}\nRating: ${rating}/5\nComments:\n${comments}`
    };

    if (process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
      console.log('Feedback email sent to agupta4501@gmail.com');
      return res.status(200).json({ success: true, message: 'Feedback email sent successfully!' });
    } else {
      console.log('SMTP_PASS is not configured in .env. Logging feedback locally.');
      return res.status(200).json({
        success: true,
        message: 'Feedback received! (SMTP simulated: details logged to server console).'
      });
    }
  } catch (err) {
    console.error('Error sending feedback email:', err);
    return res.status(500).json({
      success: false,
      message: 'Server failed to send feedback email.',
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`✨ Velvet Thread Stylist server running at http://localhost:${PORT}`);
});
