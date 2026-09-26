// =========================================================
// VELVET THREAD — Digital Stylist Platform
// =========================================================

// State management
let profile = {
    faceShape: '',
    bodyShape: '',
    colorTone: '',
    event: '',
    traits: []
};

let currentRating = 0;
let chatHistory = [];
let currentModalItem = '';
let currentTrendItem = '';

// =========================================================
// STARTUP
// =========================================================
window.addEventListener('DOMContentLoaded', () => {
    const savedProfile = localStorage.getItem('velvet_style_profile');
    if (savedProfile) {
        profile = JSON.parse(savedProfile);
        updateDashboardContent();
        showView('dashboard');

        appendBotMessage(`Welcome back, darling! ✨ I've refreshed your Velvet Thread style file.

Your look profile: **${profile.bodyShape}** silhouette · **${profile.faceShape}** face · **${profile.colorTone}** complexion.

You're dressing for a **${profile.event || 'fabulous event'}** — and I already have *three* spectacular looks in mind for you. Ask me anything — outfits, hair, jewellery, makeup, or today's hottest trends. Let's make you unforgettable! 💫`);
    } else {
        showView('profile');
    }
});

// =========================================================
// SPA NAVIGATION
// =========================================================
function showView(viewId) {
    document.querySelectorAll('.spa-view').forEach(view => {
        view.classList.add('hidden');
    });

    const activeView = document.getElementById(`view-${viewId}`);
    if (activeView) {
        activeView.classList.remove('hidden');
    }

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-primary', 'font-bold', 'border-b-2', 'border-primary', 'pb-1');
        btn.classList.add('text-gray-500');
    });

    const activeNavBtn = document.getElementById(`nav-${viewId}`);
    if (activeNavBtn) {
        activeNavBtn.classList.remove('text-gray-500');
        activeNavBtn.classList.add('text-primary', 'font-bold', 'border-b-2', 'border-primary', 'pb-1');
    }
}

// =========================================================
// PROFILE SETUP
// =========================================================
function setProfileAttr(key, value, element) {
    profile[key] = value;
    const parent = element.parentElement;
    parent.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('active-selection');
    });
    element.classList.add('active-selection');
}

function toggleProfileTrait(trait, element) {
    const index = profile.traits.indexOf(trait);
    if (index > -1) {
        profile.traits.splice(index, 1);
        element.classList.remove('bg-primary', 'text-white');
        element.classList.add('bg-gray-100', 'text-gray-900');
    } else {
        profile.traits.push(trait);
        element.classList.remove('bg-gray-100', 'text-gray-900');
        element.classList.add('bg-primary', 'text-white');
    }
}

function saveStyleProfile() {
    profile.event = document.getElementById('profile-event').value || 'Gallery Opening';

    if (!profile.bodyShape || !profile.faceShape || !profile.colorTone) {
        alert('Please select your Face Shape, Body Silhouette, and Complexion Tone first!');
        return;
    }

    const overlay = document.getElementById('loading-overlay');
    overlay.classList.remove('hidden');

    setTimeout(() => {
        localStorage.setItem('velvet_style_profile', JSON.stringify(profile));
        updateDashboardContent();
        overlay.classList.add('hidden');
        showView('dashboard');

        chatHistory = [];
        const historyContainer = document.getElementById('chat-history');
        historyContainer.innerHTML = '';

        appendBotMessage(`Oh, I love this! Your Velvet Thread style card is looking absolutely *stunning*. ✨

Here's what I know about you:
- 🎉 **Event**: ${profile.event}
- 👤 **Body Shape**: ${profile.bodyShape}
- 💆 **Face Structure**: ${profile.faceShape}  
- 🎨 **Complexion**: ${profile.colorTone.split(' ')[0]}
- 💎 **Aesthetic**: ${profile.traits.length ? profile.traits.join(', ') : 'Versatile'}

Honestly? With your ${profile.bodyShape} figure and ${profile.faceShape} face, you have *so* much to work with. I'm thinking structured elegance with the right proportions. But let me hear from you — what would you like to explore first? Outfit magic, hair glamour, or jewellery harmony? 💫`);
    }, 1500);
}

// =========================================================
// DASHBOARD CONTENT
// =========================================================
function updateDashboardContent() {
    document.getElementById('welcome-title').innerText = `Good ${getTimeOfDay()}, Stylist.`;
    document.getElementById('welcome-subtitle').innerText = `Your Velvet Thread lookbook is curated for your upcoming ${profile.event || 'event'}.`;

    const mainTrait = profile.traits[0] || 'Modern';
    document.getElementById('curated-outfit-title').innerText = `The ${mainTrait} Curator`;

    const faceShapeKey = (profile.faceShape || '').toLowerCase().trim();
    const hairByFaceShape = {
        diamond: 'Sleek Low Bun',
        oval: 'Textured Lob',
        round: 'Voluminous High Pony',
        square: 'Side-Swept Soft Waves',
        heart: 'Layered Collarbone Bob',
        oblong: 'Soft Curtain Bangs with Long Waves',
        triangle: 'Feathered Shoulder-Length Layers'
    };

    let hairStyle = hairByFaceShape[faceShapeKey] || 'Sleek Low Bun';
    document.getElementById('dashboard-hair-title').innerText = hairStyle;

    let noteText = `"For your ${profile.event}, this curated outfit combines structure and balance. `;
    switch (profile.bodyShape.toLowerCase()) {
        case 'hourglass':
            noteText += `The tailored blazer cinches nicely to highlight your defined hourglass waist, while clean straight trousers add length.`;
            break;
        case 'rectangular':
            noteText += `The structured shoulders of the blazer add shape to your athletic frame, creating beautiful proportions.`;
            break;
        case 'pear':
            noteText += `The blazer's shoulder detailing draws attention upward, elegantly balancing your pear silhouette.`;
            break;
        case 'apple':
            noteText += `We recommend wearing the structured blazer open to create a long vertical panel, lengthening your silhouette.`;
            break;
        case 'inverted triangle':
            noteText += `Pairing this blazer with wider trousers balances your broader shoulders and creates a symmetrical outline.`;
            break;
        default:
            noteText += `The simple clean cuts fit your physique perfectly for an editorial finish.`;
    }

    if (profile.colorTone.toLowerCase().includes('warm')) {
        noteText += ` We paired this look with a warm terracotta top and 18k gold jewellery to harmonize with your warm, glowing complexion."`;
    } else {
        noteText += ` We styled this with neutral charcoal and high-contrast accessories to create a contemporary contrast on your skin tone."`;
    }
    document.getElementById('curated-stylist-note').innerText = noteText;

    let analysisText = `Based on your **${profile.faceShape}** face structure and professional styling guidelines, we recommend a **${hairStyle}**. `;
    switch (faceShapeKey) {
        case 'diamond': analysisText += `This style softens your prominent cheekbones and jawline, focusing attention on your eyes.`; break;
        case 'oval': analysisText += `This cut showcases your symmetrical face proportions and lets your features breathe.`; break;
        case 'round': analysisText += `The height of this style visually elongates your face, adding vertical balance.`; break;
        case 'square': analysisText += `The soft framing layers break the angularity of your jawline, giving a softer look.`; break;
        case 'heart': analysisText += `This length adds width around your narrower chin, balancing your forehead.`; break;
        case 'oblong': analysisText += `This soft framing keeps the face proportional while reducing the appearance of length.`; break;
        case 'triangle': analysisText += `This layered shape opens the jawline and adds softness to the lower face.`; break;
        default: analysisText += `This style creates a polished, elegant frame for your facial features.`;
    }
    document.getElementById('hair-analysis-text').innerHTML = analysisText;

    const checkmarks = document.getElementById('harmony-details');
    checkmarks.innerHTML = `
        <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
            <span>${profile.bodyShape} Silhouette Match</span>
        </div>
        <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
            <span>${profile.colorTone.split(' ')[0]} Tone Harmonizer</span>
        </div>
        <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
            <span>${profile.faceShape} Face Balanced</span>
        </div>
    `;
}

function getTimeOfDay() {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
}

// =========================================================
// WARDROBE FILTER
// =========================================================
function filterWardrobe(category, btn) {
    document.querySelectorAll('.wardrobe-filter-btn').forEach(b => {
        b.classList.remove('active-filter', 'bg-primary', 'text-white', 'border-primary');
        b.classList.add('border-gray-200', 'text-gray-600');
    });
    btn.classList.add('active-filter', 'bg-primary', 'text-white', 'border-primary');
    btn.classList.remove('border-gray-200', 'text-gray-600');

    document.querySelectorAll('.wardrobe-card').forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = '';
            card.classList.add('animate-fade-in');
        } else {
            card.style.display = 'none';
        }
    });
}

// =========================================================
// TREND FILTER
// =========================================================
function filterTrends(category, btn) {
    document.querySelectorAll('.trend-filter-btn').forEach(b => {
        b.classList.remove('active-filter', 'bg-primary', 'text-white', 'border-primary');
        b.classList.add('border-gray-200', 'text-gray-600');
    });
    btn.classList.add('active-filter', 'bg-primary', 'text-white', 'border-primary');
    btn.classList.remove('border-gray-200', 'text-gray-600');

    document.querySelectorAll('.trend-card').forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// =========================================================
// WARDROBE ITEM MODAL DATA
// =========================================================
const wardrobeItemData = {
    top: {
        image: 'images/monochrome.jpg',
        tag: 'Tops',
        title: 'Earth Tone Monochrome',
        brand: 'AI Outfit Match',
        description: 'A refined tonal outfit in warm clay, sand, and mushroom shades that feels elevated, effortless, and editorial. The monochrome palette creates a clean silhouette with instant polish.',
        tips: [
            '✦ Use a single dominant earthy hue and mix textures for depth',
            '✦ Gold jewellery sharpens the look and adds an intentional luxe finish',
            '✦ Best suited to warm and olive undertones for a naturally glowing effect'
        ]
    },
    bottom: {
        image: 'images/hero_look.png',
        tag: 'Bottoms',
        title: 'Tailored Power Blazer',
        brand: 'Editor Pick · Statement Outfit',
        description: 'A sharply tailored blazer moment built for confidence and structure. The clean line and polished proportions make this a standout piece for both power dressing and elegant occasion styling.',
        tips: [
            '✦ Pair with relaxed wide-leg trousers or fluid tailoring to keep the silhouette balanced',
            '✦ Ideal for Hourglass and Rectangle shapes when you want strong, defined structure',
            '✦ Let the blazer lead the look and keep the rest toned down for a clean editorial finish'
        ]
    },
    jewellery: {
        image: 'images/mangalsutras.jpg',
        tag: 'Accessories',
        title: 'Mangalsutra Modern',
        brand: 'Heritage Reimagined',
        description: 'A contemporary mangalsutra styling with a delicate chain and a refined pendant profile. It brings heritage and modern dressing together in a clean, sophisticated way.',
        tips: [
            '✦ Layer with a slim chain for a softly curated finish',
            '✦ Style it with sarees, lehengas, or elegant Indo-western silhouettes for festive dressing',
            '✦ Warm gold tones bring out the most elegant shine on warm and olive undertones'
        ]
    },
    hair: {
        image: 'images/lob.jpg',
        tag: 'Hair Ideas',
        title: 'Textured Lob Wave',
        brand: 'AI Recommended Hairstyle',
        description: 'This collarbone-length textured lob gives you movement, softness, and an easy editorial finish. It reads polished but not overdone, which makes it ideal for daily styling and special events alike.',
        tips: [
            '✦ Use a 1.25-inch curling iron to create soft, lived-in bends',
            '✦ Finish with a light texturizing spray for volume without stiffness',
            '✦ Especially flattering on oval, heart, and oblong face shapes'
        ]
    }
};

function openWardrobeItemModal(type) {
    const data = wardrobeItemData[type];
    if (!data) return;

    currentModalItem = type;
    document.getElementById('modal-image').src = data.image;
    document.getElementById('modal-image').alt = data.title;
    document.getElementById('modal-tag').textContent = data.tag;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-brand').textContent = data.brand;
    document.getElementById('modal-description').textContent = data.description;

    const tipsEl = document.getElementById('modal-tips');
    tipsEl.innerHTML = data.tips.map(tip => `<p class="text-sm text-gray-700">${tip}</p>`).join('');

    document.getElementById('wardrobe-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeWardrobeModal() {
    document.getElementById('wardrobe-modal').classList.add('hidden');
    document.body.style.overflow = '';
}

function askStylerAboutItem() {
    const data = wardrobeItemData[currentModalItem];
    closeWardrobeModal();
    setTimeout(() => {
        toggleChatbot();
        sendQuickMsg(`✨ Tell me more about how to style the "${data.title}" — specific outfit combinations, what events it works for, and how it works with my ${profile.bodyShape || 'body shape'} and ${profile.colorTone ? profile.colorTone.split(' ')[0] : 'skin tone'}.`);
    }, 300);
}

// =========================================================
// TREND MODAL DATA
// =========================================================
const trendModalData = {
    'hair-bun': {
        image: 'images/face_hair_mapping.png',
        badge: '🔥 Trending This Season',
        tag: 'Hair Trend',
        title: 'The Sleek Low Bun',
        description: 'Reigning supreme from Fashion Week to daily editorial shoots, the sleek low bun is the definitive power hairstyle of the moment. It softens angular features, elevates any outfit instantly, and communicates effortless sophistication.',
        tips: [
            { icon: '💆', label: 'Technique', text: 'Apply a smoothing serum through towel-dried hair, pull back at the nape, and secure with a covered elastic. Use a boar bristle brush for a lacquered finish.' },
            { icon: '✨', label: 'Accessory Tip', text: 'Elevate with a sculptural gold claw clip, velvet ribbon, or pearl pins for an editorial moment.' },
            { icon: '👤', label: 'Best Face Shapes', text: 'Diamond, Oval, Square — though honestly, every face shape can wear this with the right tendrils.' }
        ],
        tags: ['Diamond', 'Oval', 'Square', 'All Events', 'Hair']
    },
    'indian-saree-edit': {
        image: 'images/saree.jpg',
        badge: '✨ Indian Luxe',
        tag: 'Indian Outfit Trend',
        title: 'Indian Saree Editorial',
        description: 'A richly draped saree with a sculpted blouse, statement gold jewellery, and a graceful fall that feels elevated and deeply feminine. It works beautifully for festive dinners, weddings, and cultural celebrations.',
        tips: [
            { icon: '👗', label: 'Silhouette', text: 'Choose a soft silk or satin drape with a fitted blouse and a clean pallu fall for a smooth, elongated line.' },
            { icon: '💍', label: 'Jewellery Pairing', text: 'Temple gold, layered necklaces, and statement jhumkas balance the drape without overpowering it.' },
            { icon: '🌸', label: 'Best For', text: 'Hourglass and Oval shapes especially shine in structured drapes with a defined waist.' }
        ],
        tags: ['Indian', 'Festive', 'Hourglass', 'Outfit']
    },
    'royal-jhumkas': {
        image: 'images/jhumka.jpg',
        badge: '💎 Indian Heritage',
        tag: 'Jewellery Trend',
        title: 'Royal Jhumka Edit',
        description: 'Jhumkas and chaandbaalis bring a rich, dance-inspired energy to traditional and Indo-western styling. The key is choosing a proportion that frames your face without competing with your outfit.',
        tips: [
            { icon: '🔔', label: 'Styling Rule', text: 'Keep the earrings as the focal point, especially when your neckline is clean or a low bun is worn.' },
            { icon: '🌞', label: 'Metal Guide', text: 'Yellow gold and antique gold tones look especially luminous on warm, olive, and festive skin undertones.' },
            { icon: '👤', label: 'Face Shape Fit', text: 'Round and Oval faces glow with longer jhumka drops; Square faces look stunning with softer curved motifs.' }
        ],
        tags: ['Indian', 'Gold', 'Warm Tone', 'Accessory']
    },
    'soft-bollywood-bob': {
        image: 'images/bollywood%20bob.jpg',
        badge: '🌸 Bollywood Soft Glam',
        tag: 'Hair Trend',
        title: 'Soft Bollywood Bob',
        description: 'A polished collarbone bob with subtle movement and side-swept volume gives you that polished yet expressive cinema-inspired finish. It is graceful, modern, and wedding-ready.',
        tips: [
            { icon: '💇', label: 'Finish', text: 'Use a curling iron to add soft bends and finish with a shine mist. Avoid too much volume at the crown for a sleek, luxe look.' },
            { icon: '✨', label: 'Pairing', text: 'This works beautifully with Kanjivaram saris, lehengas, and elegant Indo-western blouses.' },
            { icon: '👤', label: 'Best Face Shapes', text: 'Oval, Heart, and Oblong faces look especially beautiful in this elegant collarbone line.' }
        ],
        tags: ['Indian', 'Oval', 'Heart', 'Hair']
    },
    'lehenga-luxe': {
        image: 'images/lengha.jpg',
        badge: '✨ Celebration Edit',
        tag: 'Indian Outfit Trend',
        title: 'Lehenga Luxe',
        description: 'A celebratory lehenga with a sharply tailored blouse and a full, fluid skirt creates a modern festive silhouette that feels rich, graceful, and slightly editorial.',
        tips: [
            { icon: '👗', label: 'Silhouette', text: 'Choose a fitted blouse with a slightly flared skirt to add volume without losing shape. High heels keep the line elegant.' },
            { icon: '💎', label: 'Accessories', text: 'Pair with chandelier earrings and a stacked bracelet set. Bare shoulders and a delicate chain work beautifully.' },
            { icon: '👤', label: 'Best For', text: 'Hourglass, Oval, and Apple shapes can carry this dramatic festive volume especially well.' }
        ],
        tags: ['Indian', 'Festive', 'Hourglass', 'Outfit']
    },
    'mangalsutra-modern': {
        image: 'images/mangalsutras.jpg',
        badge: '💍 Modern Heritage',
        tag: 'Jewellery Trend',
        title: 'Mangalsutra Modern',
        description: 'The mangalsutra is being reimagined in a cleaner, more refined way — delicate chains, softer pendants, and subtle layering give it a modern edge that still feels rooted in tradition.',
        tips: [
            { icon: '🔗', label: 'Layering', text: 'Layer the mangalsutra with a slim chain or a delicate pendant necklace for a balanced contemporary edit.' },
            { icon: '🌿', label: 'Styling', text: 'Works beautifully with both sarees and elegant Indo-western silhouettes for day-to-night festive dressing.' },
            { icon: '✨', label: 'Metal Note', text: 'Warm gold tones elevate the look best for warm and olive skin tones.' }
        ],
        tags: ['Indian', 'Heritage', 'Warm Tone', 'Accessory']
    },
    'earth-tones': {
        image: 'images/monochrome.jpg',
        badge: '✨ Editor\'s Pick',
        tag: 'Outfit Trend',
        title: 'Earth Tone Monochromes',
        description: 'The monochrome earth tone movement is dominating every runway from The Row to Totême. Dressing head-to-toe in terracotta, burnt sienna, clay, sand, or warm mushroom creates a visual harmony that feels ultra-luxe and deeply personal.',
        tips: [
            { icon: '🎨', label: 'Color Formula', text: 'Anchor your look with a deep terracotta base and layer in lighter clay and sand tones. Texture mixing — knit with linen with leather — amplifies the richness.' },
            { icon: '💎', label: 'Jewellery Pairing', text: '18k gold is your non-negotiable partner here. Chunky gold links against terracotta is a combination that\'s almost criminally chic.' },
            { icon: '🌿', label: 'Skin Tone Match', text: 'This palette sings for warm and olive complexions. Cooler skin tones can lean into the lighter sand and camel shades.' }
        ],
        tags: ['Warm Skin', 'Pear', 'Hourglass', 'Monochrome', 'Outfit']
    },
    'chunky-gold': {
        image: 'images/accessories.png',
        badge: '💎 Luxury Trend',
        tag: 'Accessory Trend',
        title: 'Chunky Gold Links',
        description: 'Geometric, sculptural, impossibly chic — the chunky gold link chain is the jewellery statement of the season. Seen at Bottega Veneta, Celine, and Jacquemus, it\'s the piece that transforms a simple outfit into an entire look.',
        tips: [
            { icon: '🔗', label: 'Layering Rule', text: 'Wear the bold chain solo for maximum impact, or layer over a delicate fine chain for modern depth. Never more than three layers total.' },
            { icon: '👕', label: 'Neckline Pairing', text: 'Crew necks, square necklines, and V-necks all work beautifully. Avoid turtlenecks — let your gold breathe.' },
            { icon: '🌟', label: 'Metal Guide', text: 'Yellow gold for warm skin undertones; rose gold as a bridge between warm and cool. High-polish silver for cool-toned complexions.' }
        ],
        tags: ['All Body Shapes', 'Warm Tone', 'Cool Tone', 'Gold', 'Accessory']
    },
    'blazer-power': {
        image: 'images/hero_look.png',
        badge: '🌿 New This Season',
        tag: 'Outfit Trend',
        title: 'Power Blazer Moment',
        description: 'The power blazer has evolved. No longer stiff boardroom armor, today\'s version is deliberately oversized, fluid through the shoulders, and paired with unexpected pieces. The formula: structured blazer + wide-leg trouser + minimal accessories = a silhouette that commands any room.',
        tips: [
            { icon: '📐', label: 'Sizing Secret', text: 'Go one or two sizes up for the true power silhouette. The shoulder seam dropping slightly past your natural shoulder is the editorial look.' },
            { icon: '⚖️', label: 'Proportion Play', text: 'Balance oversized volume on top with a fluid, wide-leg trouser. Never pair an oversized blazer with skinny jeans — the proportions fight.' },
            { icon: '🎯', label: 'Body Shape Tip', text: 'Hourglass and Rectangular shapes shine here. Pear shapes can do this look by choosing a blazer that grazes the hip without clinging.' }
        ],
        tags: ['Hourglass', 'Rectangle', 'Pear', 'Formal', 'Outfit']
    },
    'textured-lob': {
        image: 'images/lob.jpg',
        badge: '🌊 Effortless Chic',
        tag: 'Hair Trend',
        title: 'Textured Lob Wave',
        description: 'The textured lob — a collarbone-grazing, lived-in wave — is the most low-maintenance high-impact hairstyle of the moment. It reads as simultaneously put-together and effortlessly cool, which is exactly the energy every great stylist is chasing right now.',
        tips: [
            { icon: '🌊', label: 'Wave Technique', text: 'Section hair and wrap around a 1.25" curling iron, holding 8-10 seconds. Shake out with fingers (never a brush) and finish with texturizing spray.' },
            { icon: '✂️', label: 'Maintenance', text: 'A blunt or beveled cut at collarbone length every 6-8 weeks keeps the shape fresh. Ask for "lived-in texture" when you visit your stylist.' },
            { icon: '💡', label: 'Versatility', text: 'The textured lob works with virtually any face shape. Oval faces are especially lucky — every direction of parting looks stunning.' }
        ],
        tags: ['Oval', 'Heart', 'Diamond', 'Casual to Formal', 'Hair']
    },
    'minimalist-stack': {
        image: 'images/accessories.png',
        badge: '🔮 Modern Classic',
        tag: 'Accessory Trend',
        title: 'Minimalist Stack',
        description: 'The art of restraint. A carefully curated stack of delicate rings and layered fine chains — this look is the antithesis of maximalism and somehow more powerful for it. The best minimalist stacks look accidental but are, in fact, obsessively considered.',
        tips: [
            { icon: '🔢', label: 'The Rule of Three', text: 'Three items maximum per stack: one statement, one texture, one simple. More than three and the look reads as cluttered.' },
            { icon: '🥈', label: 'Metal Mastery', text: 'Choose one metal family and stay within it. Mixing silver and gold reads as accidental, not intentional — unless you\'re mixing textures within the same metal tone.' },
            { icon: '👆', label: 'Ring Stacking Formula', text: 'One bold ring on your index finger, a delicate band mid-finger, and leave the thumb bare. Simple, editorial, perfect.' }
        ],
        tags: ['Cool Tone', 'Rectangle', 'All Shapes', 'Minimalist', 'Accessory']
    }
};

function openTrendModal(trendId) {
    const data = trendModalData[trendId];
    if (!data) return;

    currentTrendItem = data.title;
    document.getElementById('trend-modal-image').src = data.image;
    document.getElementById('trend-modal-badge').textContent = data.badge;
    document.getElementById('trend-modal-tag').textContent = data.tag;
    document.getElementById('trend-modal-title').textContent = data.title;
    document.getElementById('trend-modal-description').textContent = data.description;

    const tipsEl = document.getElementById('trend-modal-tips');
    tipsEl.innerHTML = data.tips.map(tip => `
        <div class="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
            <span class="text-lg">${tip.icon}</span>
            <div>
                <p class="text-xs font-bold text-primary uppercase tracking-widest">${tip.label}</p>
                <p class="text-sm text-gray-700 mt-0.5">${tip.text}</p>
            </div>
        </div>
    `).join('');

    const tagsEl = document.getElementById('trend-modal-tags');
    tagsEl.innerHTML = data.tags.map(tag =>
        `<span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">${tag}</span>`
    ).join('');

    document.getElementById('trend-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeTrendModal() {
    document.getElementById('trend-modal').classList.add('hidden');
    document.body.style.overflow = '';
}

function askStylerAboutTrend() {
    closeTrendModal();
    setTimeout(() => {
        toggleChatbot();
        sendQuickMsg(`✨ Tell me everything about the "${currentTrendItem}" trend — how it works for my specific profile (${profile.bodyShape || 'body shape'}, ${profile.faceShape || 'face shape'}, ${profile.colorTone ? profile.colorTone.split(' ')[0] : 'skin tone'}), how to wear it for ${profile.event || 'my event'}, and give me your most creative styling tips.`);
    }, 300);
}

// =========================================================
// WARDROBE AI TOGGLE
// =========================================================
function toggleAIRecommendations() {
    const block = document.getElementById('ai-recommendations-block');
    const toggle = document.getElementById('ai-toggle-btn');
    const knob = document.getElementById('ai-toggle-knob');

    const isHidden = block.classList.contains('hidden');
    if (isHidden) {
        block.classList.remove('hidden');
        toggle.classList.add('bg-primary');
        toggle.classList.remove('bg-gray-300');
        knob.classList.add('translate-x-5');
    } else {
        block.classList.add('hidden');
        toggle.classList.remove('bg-primary');
        toggle.classList.add('bg-gray-300');
        knob.classList.remove('translate-x-5');
    }
}

// =========================================================
// FEEDBACK
// =========================================================
function setFeedbackRating(rating) {
    currentRating = rating;
    const parent = document.getElementById('rating-buttons');
    parent.querySelectorAll('.rating-btn').forEach((btn, idx) => {
        if (idx < rating) {
            btn.classList.add('active-rating');
        } else {
            btn.classList.remove('active-rating');
        }
    });
}

function showFeedbackPrompt() {
    alert("Look adopted! Redirecting you to the feedback page to share your experience with the Velvet Thread styling algorithm.");
    showView('feedback');
}

async function submitFeedbackForm(event) {
    event.preventDefault();

    const name = document.getElementById('feedback-name').value;
    const email = document.getElementById('feedback-email').value;
    const comments = document.getElementById('feedback-comments').value;
    const msgElement = document.getElementById('feedback-message');

    if (currentRating === 0) {
        msgElement.innerText = "Please select a rating from 1 to 5.";
        msgElement.classList.remove('hidden', 'bg-emerald-100', 'text-emerald-800');
        msgElement.classList.add('bg-rose-100', 'text-rose-800');
        return;
    }

    msgElement.innerText = "Sending feedback...";
    msgElement.classList.remove('hidden', 'bg-rose-100', 'text-rose-800', 'bg-emerald-100', 'text-emerald-800');
    msgElement.classList.add('bg-gray-100', 'text-gray-700');

    try {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, rating: currentRating, comments })
        });
        const data = await response.json();

        if (response.ok && data.success) {
            msgElement.innerText = data.message;
            msgElement.classList.remove('bg-gray-100', 'text-gray-700');
            msgElement.classList.add('bg-emerald-100', 'text-emerald-800');
            document.getElementById('feedback-form').reset();
            setFeedbackRating(0);
        } else {
            msgElement.innerText = data.message || "Failed to submit feedback.";
            msgElement.classList.remove('bg-gray-100', 'text-gray-700');
            msgElement.classList.add('bg-rose-100', 'text-rose-800');
        }
    } catch (err) {
        console.error("Feedback error:", err);
        msgElement.innerText = "Connection error: Could not reach backend server.";
        msgElement.classList.remove('bg-gray-100', 'text-gray-700');
        msgElement.classList.add('bg-rose-100', 'text-rose-800');
    }
}

// =========================================================
// CHATBOT UI
// =========================================================
function toggleChatbot() {
    const panel = document.getElementById('chatbot-panel');
    const isHidden = panel.classList.contains('pointer-events-none');
    if (isHidden) {
        panel.classList.remove('pointer-events-none', 'opacity-0', 'translate-y-12');
        panel.classList.add('opacity-100', 'translate-y-0');
    } else {
        panel.classList.add('pointer-events-none', 'opacity-0', 'translate-y-12');
        panel.classList.remove('opacity-100', 'translate-y-0');
    }
}

function appendUserMessage(text) {
    const container = document.getElementById('chat-history');
    const div = document.createElement('div');
    div.className = 'message-bubble user-message self-end';
    div.innerText = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function appendBotMessage(text) {
    const container = document.getElementById('chat-history');
    const div = document.createElement('div');
    div.className = 'message-bubble bot-message bg-primary/5 border border-primary/10 text-on-background';

    let formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br/>');

    div.innerHTML = formattedText;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function appendTypingIndicator() {
    const container = document.getElementById('chat-history');
    const div = document.createElement('div');
    div.id = 'typing-indicator';
    div.className = 'message-bubble bot-message bg-primary/5 border border-primary/10 text-on-background flex gap-1 items-center';
    div.innerHTML = `<span class="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style="animation-delay:0s"></span>
                     <span class="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style="animation-delay:0.15s"></span>
                     <span class="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style="animation-delay:0.3s"></span>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

// =========================================================
// CHAT API
// =========================================================
async function submitChatMessage(event) {
    event.preventDefault();
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    input.value = '';
    appendUserMessage(message);
    appendTypingIndicator();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message,
                profile: profile,
                history: chatHistory
            })
        });

        const data = await response.json();
        removeTypingIndicator();

        if (response.ok && data.response) {
            appendBotMessage(data.response);
            chatHistory.push({ role: 'user', content: message });
            chatHistory.push({ role: 'model', content: data.response });
        } else {
            appendBotMessage("I encountered a small alignment issue styling my response. Please try asking again!");
        }
    } catch (err) {
        removeTypingIndicator();
        console.error("Chat error:", err);
        appendBotMessage("Connection failed. Please check if the local Node server is running!");
    }
}

function sendQuickMsg(text) {
    const input = document.getElementById('chat-input');
    input.value = text;
    document.querySelector('#chatbot-panel form').dispatchEvent(new Event('submit'));
}

// =========================================================
// KEYBOARD SHORTCUTS
// =========================================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeWardrobeModal();
        closeTrendModal();
    }
});
