import { Kundli } from "./types";


const data = [
    {
        "planet": "Sun",
        "nature": "soul, vitality, self, authority, leadership, father",
        "houses": {
            "1": { "prediction": "Strong vitality, confident personality, natural leadership qualities, and commanding presence.", "rashi_effect": "Self-respect and dignity in public persona." },
            "2": { "prediction": "Focus on family prestige, authoritative speech, wealth through government or independent efforts.", "rashi_effect": "Direct communication and concern for family reputation." },
            "3": { "prediction": "High courage, strong initiative, determined efforts, energetic communication and travel.", "rashi_effect": "Self-reliant nature and dynamic drive." },
            "4": { "prediction": "Leadership in family, focus on heritage and property, dignified home environment.", "rashi_effect": "Strong domestic influence and attachment to ancestral roots." },
            "5": { "prediction": "Sharp intellect, creative authority, interest in governance or higher wisdom, proud lineage.", "rashi_effect": "Creative vitality and confident educational pursuits." },
            "6": { "prediction": "Ability to overcome competitors and debts, strong immune resilience, victory over obstacles.", "rashi_effect": "Authoritative problem solving and determined work ethic." },
            "7": { "prediction": "Commanding partner, high standards in relationships, public recognition through partnerships.", "rashi_effect": "Strong personality in marriage and social dealings." },
            "8": { "prediction": "Deep interest in occult or research, transformative life path, hidden resilience.", "rashi_effect": "Intense psychological insight and profound inner power." },
            "9": { "prediction": "Dharmic inclinations, respect for tradition and mentors, auspicious long journeys and spiritual growth.", "rashi_effect": "Principled worldview and noble character." },
            "10": { "prediction": "High career ambitions, administrative power, public status, recognition in profession.", "rashi_effect": "Natural executive capability and career prominence." },
            "11": { "prediction": "Gains through influential connections, ambitious long-term goals, leadership in community.", "rashi_effect": "Authoritative social network and steady fulfillment of desires." },
            "12": { "prediction": "Spiritual retreat, interest in meditation, connections with distant places, charitable nature.", "rashi_effect": "Inner contemplation and detachment from ego." }
        }
    },
    {
        "planet": "Moon",
        "nature": "mind, emotions, intuition, mother, peace, mental happiness",
        "houses": {
            "1": { "prediction": "Sensitive nature, magnetic charm, emotional responsiveness, caring and nurturing personality.", "rashi_effect": "Adaptive, expressive, and emotionally receptive temperament." },
            "2": { "prediction": "Sweet speech, family attachment, fluctuating finances with steady nurturing instincts.", "rashi_effect": "Resource preservation and emotional bonding with family." },
            "3": { "prediction": "Curious mind, expressive communication, affectionate relationship with siblings, frequent short travels.", "rashi_effect": "Artistic communication and intuitive learning." },
            "4": { "prediction": "Deep maternal connection, domestic peace, comfort in home environment, emotional security.", "rashi_effect": "Strong inner contentment and love for ancestral home." },
            "5": { "prediction": "Creative imagination, emotional warmth with children, romantic and intuitive intellect.", "rashi_effect": "Poetic expression and joyful creative projects." },
            "6": { "prediction": "Service-oriented mind, attention to health routines, emotional resilience in handling daily tasks.", "rashi_effect": "Empathetic problem solving and desire to help others." },
            "7": { "prediction": "Emotional bonding with spouse, romantic partnership, public popularity and social grace.", "rashi_effect": "Sympathetic and cooperative relationship dynamics." },
            "8": { "prediction": "Deep intuition, psychic sensitivity, emotional transformations, interest in the mysterious.", "rashi_effect": "Intense emotional depth and investigative mind." },
            "9": { "prediction": "Devotion, love for pilgrimages and philosophy, ethical mindset, guidance from elders.", "rashi_effect": "Philosophical optimism and spiritual curiosity." },
            "10": { "prediction": "Public appeal, career in public welfare, leadership with compassion, high reputation.", "rashi_effect": "Emotionally satisfying profession and broad public rapport." },
            "11": { "prediction": "Warm friendships, supportive circles, steady gains through social goodwill and hopes.", "rashi_effect": "Pleasant social life and fulfilled emotional aspirations." },
            "12": { "prediction": "Vivid dreams, spiritual imagination, inclination for quiet retreats, charitable empathy.", "rashi_effect": "Subconscious insight, meditative peace, and compassion." }
        }
    },
    {
        "planet": "Mars",
        "nature": "energy, courage, aggression, action; retro-nature: delayed actions, redirected aggression, internalized drive",
        "retro_general": "Taakat aur krodh internalize hote hain — direct action se pehle strategy change karein; lawsuits/accidents me caution.",
        "rashi_behavior_general": "Mars retro in a fiery sign increases controlled aggression; in water/earth signs it channels into inner determination or suppressed anger.",
        "houses": {
            "1": { "prediction": "Physical energy and assertiveness subdued or redirected; boldness internal.", "rashi_effect": "Lagna me combative aura but inwardly cautious." },
            "2": { "prediction": "Speech & finances: impulsive spending curbed; arguments over family property may resurface.", "rashi_effect": "Financial risks re-evaluated." },
            "3": { "prediction": "Courage & siblings: boldness arises later; short travel interruptions.", "rashi_effect": "Initiatives require rework." },
            "4": { "prediction": "Home disputes may surface; property work delayed but forceful when acted upon.", "rashi_effect": "Domestic energy suppressed." },
            "5": { "prediction": "Romance & children: passion reviewed; children-related action delayed.", "rashi_effect": "Romantic impulses revisit from past." },
            "6": { "prediction": "Enemies & health: retro Mars can help overcome chronic problems via inner discipline.", "rashi_effect": "Veteran fighter energy — resolve builds slowly." },
            "7": { "prediction": "Partnership conflicts; competitive partner, legal fights delayed/revisited.", "rashi_effect": "Marital disputes may need controlled response." },
            "8": { "prediction": "Sudden transformations, surgeries: accidents or surgeries require caution; secret anger.", "rashi_effect": "Hidden conflicts intensify." },
            "9": { "prediction": "Beliefs & foreign affairs: travel/warlike ventures postponed; strong convictions rekindled.", "rashi_effect": "Philosophical courage re-examined." },
            "10": { "prediction": "Career aggression channelled internally; slow but decisive career moves.", "rashi_effect": "Ambition restructured; eventual assertive success." },
            "11": { "prediction": "Gains via assertive planning delayed; network competition resurfacing.", "rashi_effect": "Group leadership tested." },
            "12": { "prediction": "Hidden enemies, expenses: secretive aggression, withdraw to recover energy.", "rashi_effect": "Retreat helps regain force." }
        }
    },
    {
        "planet": "Mercury",
        "nature": "communication, intellect, trade; retro-nature: rethinking, revising plans, miscommunications",
        "retro_general": "Communication/commerce rework phase — contracts, studies, travel can be delayed; double-check details.",
        "rashi_behavior_general": "Retro Mercury in Gemini/Virgo (its signs) increases internal analysis; in others causes review of ideas and delays in deals.",
        "houses": {
            "1": { "prediction": "Self-thinking revisited; nervous energy; speech rephrased.", "rashi_effect": "Personality more analytical." },
            "2": { "prediction": "Speech & finance: documents need review; delayed receipts.", "rashi_effect": "Careful with monetary negotiations." },
            "3": { "prediction": "Siblings/short communications slowed; redoing projects.", "rashi_effect": "Rewriting & resending messages." },
            "4": { "prediction": "Education/home paperwork delays; revise property documents.", "rashi_effect": "Technical home matters re-evaluated." },
            "5": { "prediction": "Study/creative writing rework; children-related paperwork.", "rashi_effect": "Creative re-editing." },
            "6": { "prediction": "Health paperwork, service contracts need review; litigation details re-open.", "rashi_effect": "Analytical approach to problems." },
            "7": { "prediction": "Partnership negotiations face miscommunication; renegotiate terms.", "rashi_effect": "Contracts re-discussed." },
            "8": { "prediction": "Research, occult studies reviewed; joint finances rechecked.", "rashi_effect": "Investigation deepens." },
            "9": { "prediction": "Higher studies/foreign travel postponed; philosophies rethought.", "rashi_effect": "Relearning, language study." },
            "10": { "prediction": "Career communications, proposals need revision; PR slow.", "rashi_effect": "Strategy rework at workplace." },
            "11": { "prediction": "Networking messages misfired; income streams via trade delayed.", "rashi_effect": "Idea refinement needed." },
            "12": { "prediction": "Hidden communications, secret plans re-evaluated; spiritual study revisited.", "rashi_effect": "Inner intellectual work." }
        }
    },
    {
        "planet": "Jupiter",
        "nature": "knowledge, expansion, luck, dharma; retro-nature: inner wisdom, delayed growth, revisiting beliefs",
        "retro_general": "Seek internal growth and revisit ethical/educational choices; outward gains may slow but mature.",
        "rashi_behavior_general": "Retro Jupiter in Sagittarius/ Pisces (own signs) deepens inner dharma; in other signs it asks to re-evaluate moral/financial expansion.",
        "houses": {
            "1": { "prediction": "Inner growth modifies personality; wisdom appears later; leadership rethought.", "rashi_effect": "Spiritual maturity increases." },
            "2": { "prediction": "Wealth & values re-evaluated; charitable instincts reworked.", "rashi_effect": "Delayed financial expansion but ethical gains." },
            "3": { "prediction": "Learning & siblings: re-study; distant learning delayed.", "rashi_effect": "Broadened educational perspective." },
            "4": { "prediction": "Home/comforts: expansion plans slow; spiritual home matters.", "rashi_effect": "Domestic teaching role increases." },
            "5": { "prediction": "Education/children: schooling decisions revisited; creative maturity.", "rashi_effect": "Delayed but solid educational growth." },
            "6": { "prediction": "Enemies/health: work on improving routines; small gains via discipline.", "rashi_effect": "Service orientation refined." },
            "7": { "prediction": "Partnerships: marriage/partnership lessons; legal contracts rethought.", "rashi_effect": "Principled approach to relationships." },
            "8": { "prediction": "Shared resources/occult: deep financial or spiritual transformations; inheritances delayed.", "rashi_effect": "Profound inner learning." },
            "9": { "prediction": "Higher learning & travel: philosophies reworked; foreign travel postponed.", "rashi_effect": "Long-term study revised." },
            "10": { "prediction": "Career & status: ethical reorientation; teacher/leader roles come later.", "rashi_effect": "Karmic vocation alignment." },
            "11": { "prediction": "Gains from wisdom delayed; networks for growth restructured.", "rashi_effect": "Long-term aspirations reviewed." },
            "12": { "prediction": "Spiritual losses/retreat: inner expansion through isolation.", "rashi_effect": "Mystical insight deepens." }
        }
    },
    {
        "planet": "Venus",
        "nature": "love, relationships, luxury, arts; retro-nature: past relationships revisited, re-evaluation of tastes",
        "retro_general": "Purana prem/drishti wapas aata hai; relationships, contracts, creative projects rework phase.",
        "rashi_behavior_general": "Retro Venus in Taurus/Libra intensifies inner aesthetics; in other signs prompts review of attachments and values.",
        "houses": {
            "1": { "prediction": "Relationship style & charms change; aesthetic sense reworked.", "rashi_effect": "Personal attraction goes inward." },
            "2": { "prediction": "Money & comforts: spending on luxury reviewed; relationship tied to resources re-evaluated.", "rashi_effect": "Material attachments questioned." },
            "3": { "prediction": "Romantic communications: old flings reappear; creative collaborations revisited.", "rashi_effect": "Artistic messages reworked." },
            "4": { "prediction": "Home comforts, motherly love re-evaluated; domestic luxuries postponed.", "rashi_effect": "Emotional luxury reconsidered." },
            "5": { "prediction": "Love affairs & children: past romances resurface; creative blocks may be reworked.", "rashi_effect": "Romance gets second chances." },
            "6": { "prediction": "Health/ service: relationship at work tested; pay attention to co-workers.", "rashi_effect": "Workplace relationships restructured." },
            "7": { "prediction": "Partnerships/marriage: old partners may return; renegotiation of terms.", "rashi_effect": "Marital reassessment." },
            "8": { "prediction": "Intimacy & shared resources: secrets of relationships come up; transformational love.", "rashi_effect": "Karmic intimacy." },
            "9": { "prediction": "Love for philosophy/foreign love affairs: long-distance romances revisited.", "rashi_effect": "Romantic ideals rethought." },
            "10": { "prediction": "Public image & profession in arts: creative career slow but becomes refined.", "rashi_effect": "Artistic career restructuring." },
            "11": { "prediction": "Gains via relationships: social love ties re-evaluated; delay in gains.", "rashi_effect": "Friends may rekindle relationships." },
            "12": { "prediction": "Secret affairs & spiritual love: hidden relationships resurface; need for spiritual love.", "rashi_effect": "Sacrificial love, retreat." }
        }
    },
    {
        "planet": "Saturn",
        "nature": "discipline, delays, karma, restrictions; retro-nature: internalized karma, slow restructuring, long-term lessons",
        "retro_general": "Karmic review time — responsibilities dikhte hain; delays expected but outcomes long lasting after perseverance.",
        "rashi_behavior_general": "Retro Saturn in Capricorn/Aquarius deepens inner discipline; in other signs it demands restructuring of the area it occupies.",
        "houses": {
            "1": { "prediction": "Personality becomes serious; maturity earlier but recognition later.", "rashi_effect": "Karmic burden visible in self-image." },
            "2": { "prediction": "Wealth via steady savings; family responsibilities increase; delays in income.", "rashi_effect": "Slow but steady finances." },
            "3": { "prediction": "Effort & siblings: hard work pays slowly; communication disciplined.", "rashi_effect": "Enduring skills develop." },
            "4": { "prediction": "Home responsibilities, property delays; emotional stability tested.", "rashi_effect": "Karmic focus on domestic duties." },
            "5": { "prediction": "Children/creativity: delays in progeny or recognition; disciplined creativity.", "rashi_effect": "Mature approach to creativity." },
            "6": { "prediction": "Enemies/health: disciplined routines beat issues; chronic problems need long care.", "rashi_effect": "Structured healing." },
            "7": { "prediction": "Partnership obligations; mature partnerships form later; delays in marriage.", "rashi_effect": "Responsible partner traits emphasized." },
            "8": { "prediction": "Deep karmic transformations; inheritances slow; occult discipline.", "rashi_effect": "Serious changes and research." },
            "9": { "prediction": "Philosophy and long travel delayed; disciplined spirituality.", "rashi_effect": "Slow spiritual growth." },
            "10": { "prediction": "Career: slow climb, eventual stability; heavy responsibilities.", "rashi_effect": "Authority through perseverance." },
            "11": { "prediction": "Gains delayed but sustainable; elder friends/supporters help slowly.", "rashi_effect": "Long-term network gains." },
            "12": { "prediction": "Isolation, spiritual penance; long retreats and karmic endings.", "rashi_effect": "Solitude for maturity." }
        }
    },
    {
        "planet": "Rahu (North Node)",
        "nature": "obsession, amplification, unconventional desires; retro-nature: intensified karmic lessons, illusions re-visited",
        "retro_general": "Rahu retro tends to reawaken past obsessions/ambitions; sudden material gains or confusion possible in occupied house.",
        "rashi_behavior_general": "Rahu retro in any rashi amplifies foreign/unconventional desires; in certain signs it brings sudden turning points related to that sign.",
        "houses": {
            "1": { "prediction": "Identity becomes unusual; sudden changes in appearance or persona from past patterns.", "rashi_effect": "Public persona becomes experimental." },
            "2": { "prediction": "Speech & possessiveness amplified; quick money temptations reappear.", "rashi_effect": "Material obsessions." },
            "3": { "prediction": "Risky communications; impulsive short journeys; siblings may be unconventional.", "rashi_effect": "Courage with odd methods." },
            "4": { "prediction": "Foreign/obsessive focus on home or property; uprooting tendencies.", "rashi_effect": "Restlessness regarding roots." },
            "5": { "prediction": "Past-life love affairs or speculative tendencies resurface; risky creativity.", "rashi_effect": "Obsessive romance." },
            "6": { "prediction": "Health and enemies: unconventional methods to tackle problems; mixed results.", "rashi_effect": "Strange solutions to difficulties." },
            "7": { "prediction": "Partnership illusions; karmic partners return; unstable unions.", "rashi_effect": "Attraction to unusual partners." },
            "8": { "prediction": "Occult/secret obsessions; big sudden changes; transformation via crisis.", "rashi_effect": "Intense karmic upheaval." },
            "9": { "prediction": "Foreign connections, belief systems challenged; sudden travels or ideology shifts.", "rashi_effect": "Unconventional philosophy." },
            "10": { "prediction": "Career spikes or scandals; unconventional profession choices.", "rashi_effect": "Ambition via odd channels." },
            "11": { "prediction": "Social gains via nontraditional networks; sudden friends appear.", "rashi_effect": "Unusual social circles." },
            "12": { "prediction": "Hidden desires, isolation, secretive escapes; spiritual obsession possible.", "rashi_effect": "Escapism & karmic dissolution." }
        }
    },
    {
        "planet": "Ketu (South Node)",
        "nature": "detachment, past karma, spirituality; retro-nature: intensified past-life themes, withdrawal",
        "retro_general": "Release of attachments; old karmic patterns surface to be resolved and let go.",
        "rashi_behavior_general": "Ketu retro urges detachment in that sign/house; spiritual purification processes intensify.",
        "houses": {
            "1": { "prediction": "Identity detaches from ego; inner solitude increases.", "rashi_effect": "Personality becomes more spiritual/detached." },
            "2": { "prediction": "Detachment from material security; speech becomes mystical.", "rashi_effect": "Letting go of family attachments." },
            "3": { "prediction": "Detached courage; reduced desire for short-term achievements.", "rashi_effect": "Inner skill cultivation." },
            "4": { "prediction": "Separation from domestic comforts; past home issues reappear.", "rashi_effect": "Innerized sense of home." },
            "5": { "prediction": "Children/creativity: less attachment; past-life creative talents resurface.", "rashi_effect": "Spiritual creativity." },
            "6": { "prediction": "Service orientation without ego; overcoming enemies via detachment.", "rashi_effect": "Healing through surrender." },
            "7": { "prediction": "Detached partnerships; karmic ties fade or transform.", "rashi_effect": "Freedom from binding relationships." },
            "8": { "prediction": "Deep past-life patterns surface; strong occult interest.", "rashi_effect": "Karmic dissolution." },
            "9": { "prediction": "Spiritual detachment from beliefs; guru/foreign ties from past.", "rashi_effect": "Inner faith restructuring." },
            "10": { "prediction": "Profession becomes less ego-driven; karmic vocation shift.", "rashi_effect": "Work as service." },
            "11": { "prediction": "Letting go of social ambitions; spiritual friends appear.", "rashi_effect": "Reduced worldly aspiration." },
            "12": { "prediction": "Strong retreat & moksha inclinations; past karma closure.", "rashi_effect": "Deep soul work; liberation focus." }
        }
    }
];




export function generateHoroscope(chart: Kundli): string {
    if (!chart || !chart.houses) return "No specific planetary predictions found for this chart.";

    let result = "## Horoscope Predictions\n\n";

    chart.houses.forEach((house) => {
        if (!house.planets || house.planets.length === 0) return;

        let houseContent = "";

        house.planets.forEach((planetKey) => {
            const pName = planetKey.toLowerCase();

            let dataPlanetName = "";
            if (pName.includes("sun")) dataPlanetName = "Sun";
            else if (pName.includes("moon")) dataPlanetName = "Moon";
            else if (pName.includes("mars")) dataPlanetName = "Mars";
            else if (pName.includes("mercury")) dataPlanetName = "Mercury";
            else if (pName.includes("jupiter")) dataPlanetName = "Jupiter";
            else if (pName.includes("venus")) dataPlanetName = "Venus";
            else if (pName.includes("saturn")) dataPlanetName = "Saturn";
            else if (pName.includes("rahu")) dataPlanetName = "Rahu (North Node)";
            else if (pName.includes("ketu")) dataPlanetName = "Ketu (South Node)";
            else return;

            const planetData = data.find((d) => d.planet === dataPlanetName);
            const planetDetails = chart.planets && (chart.planets[planetKey] || chart.planets[pName] || chart.planets[pName.charAt(0).toUpperCase() + pName.slice(1)]);

            if (planetData) {
                houseContent += `\n#### ${dataPlanetName}\n`;
                houseContent += `- **Nature:** ${planetData.nature}\n`;

                if (planetDetails && planetDetails.isRetrograde && (planetData as any).retro_general) {
                    houseContent += `- **Retrograde Status:** Planet is Retrograde\n`;
                    houseContent += `- **Retrograde Effect:** ${(planetData as any).retro_general}\n`;
                    houseContent += `- **Rashi Behavior:** ${(planetData as any).rashi_behavior_general}\n`;
                }

                const houseStr = house.number.toString() as keyof typeof planetData.houses;
                const houseEffect = planetData.houses[houseStr];

                if (houseEffect) {
                    houseContent += `- **Prediction:** ${houseEffect.prediction}\n`;
                    houseContent += `- **Rashi Effect:** ${houseEffect.rashi_effect}\n`;
                }
            }
        });

        if (houseContent !== "") {
            result += `### House ${house.number}\n` + houseContent + `\n`;
        }
    });

    if (result === "## Horoscope Predictions\n\n") {
        return "No specific planetary predictions found for this chart.";
    }

    return result.trim();
}