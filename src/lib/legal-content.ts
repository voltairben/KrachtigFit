import { siteConfig } from "@/site.config";
import type { Locale } from "@/i18n/routing";

/**
 * Drafts describing the processing this site actually performs.
 *
 * These are accurate as to what the code does — what is collected, why, on
 * what basis, who it reaches, and for how long. They are NOT legal advice and
 * must be reviewed before launch; `siteConfig.legalReviewedAt` gates the
 * production build on that review having happened.
 *
 * If the site later gains analytics, a booking embed, a CRM or a newsletter
 * platform, the recipients list below must be updated to match.
 */

export type LegalSection = { heading: string; body: string[] };
export type LegalDoc = { title: string; intro: string; sections: LegalSection[] };

const { contact, legal } = siteConfig;

export function privacyPolicy(locale: Locale): LegalDoc {
  if (locale === "nl") {
    return {
      title: "Privacybeleid",
      intro:
        "Dit beleid beschrijft welke persoonsgegevens KrachtigFit verwerkt via deze website, waarom dat gebeurt en welke rechten je hebt.",
      sections: [
        {
          heading: "Verwerkingsverantwoordelijke",
          body: [
            `KrachtigFit, ${legal.address.city}. KvK ${legal.kvk}, BTW-ID ${legal.btwId}.`,
            `Vragen over je gegevens? Mail ${contact.email}.`,
          ],
        },
        {
          heading: "Welke gegevens en waarom",
          body: [
            "Via het kennismakingsformulier verzamel ik: je naam, e-mailadres en telefoonnummer, je antwoorden op vier vragen over je doel, je belemmering, je voorkeur en je beschikbare tijd, en een eventueel vrij bericht.",
            "Deze gegevens gebruik ik uitsluitend om contact met je op te nemen over je aanvraag en om het gesprek voor te bereiden.",
            "Bij het versturen leg ik ook het tijdstip, je IP-adres en de versie van de toestemmingstekst vast. Dat is nodig om te kunnen aantonen dat en waarvoor je toestemming hebt gegeven.",
          ],
        },
        {
          heading: "Grondslag",
          body: [
            "Toestemming (artikel 6 lid 1 sub a AVG). Je geeft die door het vakje aan te vinken.",
            "Je kunt je toestemming op elk moment intrekken door te mailen naar " +
              contact.email +
              ". Dat is net zo eenvoudig als het geven ervan.",
          ],
        },
        {
          heading: "Wie ontvangt je gegevens",
          body: [
            "Vercel — hosting van de website. Verwerkt technische logs.",
            "Resend — verzending van het formulierbericht naar mijn mailbox, met dataverwerking in de EU.",
            "Cloudflare Turnstile — spamcontrole op het formulier. Turnstile plaatst geen cookies en profileert je niet.",
            "Common Ninja en Instagram/Meta — alleen als je zelf op de knop klikt om de Instagram-feed op de site te laden. Zonder die klik wordt er niets van je gegevens naar deze partijen gestuurd.",
            "Verder deel ik je gegevens niet met derden, en verkoop ik ze nooit.",
          ],
        },
        {
          heading: "Bewaartermijn",
          body: [
            "Aanvragen die niet tot samenwerking leiden bewaar ik maximaal twaalf maanden en verwijder ik daarna.",
            "Word je klant, dan bewaar ik je gegevens zolang de begeleiding loopt. Voor facturen geldt de wettelijke fiscale bewaarplicht van zeven jaar.",
          ],
        },
        {
          heading: "Cookies en meten",
          body: [
            "Deze website plaatst geen tracking- of advertentiecookies.",
            "Lettertypen worden vanaf deze website zelf geserveerd, niet vanaf een server van Google, zodat je IP-adres daar niet terechtkomt.",
          ],
        },
        {
          heading: "Je rechten",
          body: [
            "Je hebt recht op inzage, correctie, verwijdering, beperking, bezwaar en overdraagbaarheid van je gegevens. Mail " +
              contact.email +
              " en je krijgt binnen een maand antwoord.",
            "Ben je het niet eens met hoe ik met je gegevens omga, dan kun je een klacht indienen bij de Autoriteit Persoonsgegevens.",
          ],
        },
      ],
    };
  }

  return {
    title: "Privacy policy",
    intro:
      "This policy describes what personal data KrachtigFit processes through this website, why, and what rights you have.",
    sections: [
      {
        heading: "Controller",
        body: [
          `KrachtigFit, ${legal.address.city}, Netherlands. Chamber of Commerce ${legal.kvk}, VAT ID ${legal.btwId}.`,
          `Questions about your data? Email ${contact.email}.`,
        ],
      },
      {
        heading: "What is collected, and why",
        body: [
          "Through the intro-call form I collect: your name, email address and phone number, your answers to four questions about your goal, your obstacle, your preferred format and your available time, and an optional free-text message.",
          "This is used solely to contact you about your enquiry and to prepare for the conversation.",
          "On submission I also record the timestamp, your IP address and the version of the consent text. This is necessary to demonstrate that consent was given and what it covered.",
        ],
      },
      {
        heading: "Legal basis",
        body: [
          "Consent (Article 6(1)(a) GDPR), given by ticking the box.",
          `You can withdraw consent at any time by emailing ${contact.email}. Withdrawing is as easy as giving it.`,
        ],
      },
      {
        heading: "Who receives your data",
        body: [
          "Vercel — website hosting. Processes technical logs.",
          "Resend — delivers the form submission to my mailbox, with EU data processing.",
          "Cloudflare Turnstile — spam protection on the form. Turnstile sets no cookies and does not profile you.",
          "Common Ninja and Instagram/Meta — only if you click the button to load the Instagram feed on the site. Without that click, nothing is sent to these parties.",
          "Your data is not shared with anyone else, and never sold.",
        ],
      },
      {
        heading: "Retention",
        body: [
          "Enquiries that do not lead to coaching are kept for a maximum of twelve months and then deleted.",
          "If you become a client, your data is kept for the duration of the coaching. Invoices are subject to the statutory seven-year tax retention period.",
        ],
      },
      {
        heading: "Cookies and measurement",
        body: [
          "This website sets no tracking or advertising cookies.",
          "Fonts are served from this website itself, not from a Google server, so your IP address is not sent there.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          `You have the right to access, rectification, erasure, restriction, objection and portability. Email ${contact.email} and you will receive a response within one month.`,
          "If you disagree with how your data is handled, you can lodge a complaint with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens).",
        ],
      },
    ],
  };
}

/**
 * Pricing, payment terms and notice periods are deliberately not published
 * here or anywhere on the site — Sander discusses and agrees these
 * individually with each client during/after the free intro call, before any
 * coaching agreement is made, and confirms them in writing at that point.
 * This isn't a placeholder pending a future price ladder; it's the actual,
 * confirmed model (reviewed 2026-08-06, see siteConfig.legalReviewedAt).
 *
 * The withdrawal right below is statutory and does not depend on pricing
 * being public, so it is written out in full — including the fact that a
 * multi-week programme is never "fully performed" within 14 days, which is
 * where this is most often got wrong.
 */
export function termsDoc(locale: Locale): LegalDoc {
  if (locale === "nl") {
    return {
      title: "Algemene voorwaarden",
      intro: `Deze voorwaarden gelden voor alle begeleiding die KrachtigFit levert, in ${legal.address.city} en online.`,
      sections: [
        {
          heading: "Wie ik ben",
          body: [
            `KrachtigFit, ${legal.address.city}. KvK ${legal.kvk}, BTW-ID ${legal.btwId}. Bereikbaar via ${contact.email} en ${contact.phoneDisplay}.`,
          ],
        },
        {
          heading: `Bedenktijd van ${siteConfig.withdrawalPeriodDays} dagen`,
          body: [
            `Coaching die je via deze website afsluit is een overeenkomst op afstand. Je hebt daarom ${siteConfig.withdrawalPeriodDays} dagen bedenktijd, gerekend vanaf het moment dat de overeenkomst tot stand komt. Je hoeft geen reden op te geven.`,
            "Wil je dat de begeleiding al binnen die periode start, dan vraag ik je dat uitdrukkelijk te bevestigen. Je bedenktijd vervalt pas als de dienst volledig is geleverd — bij een traject van meerdere weken is daar tijdens de bedenktijd nooit sprake van.",
            "Herroep je tijdens de bedenktijd, dan betaal je uitsluitend naar rato voor het deel dat al is geleverd. Het restant krijg je binnen veertien dagen terug.",
            `Herroepen kan vormvrij, bijvoorbeeld met een mail aan ${contact.email}. Het wettelijke modelformulier voor herroeping is op verzoek beschikbaar.`,
          ],
        },
        {
          heading: "Wat ik lever, en wat niet",
          body: [
            "Ik lever begeleiding: een trainingsprogramma, feedback op je voedingslog en periodieke check-ins. Ik span me in om je te helpen je doel te halen, maar een bepaald resultaat kan ik niet garanderen — dat hangt ook af van factoren buiten mijn invloed.",
            "Ik ben geen arts of fysiotherapeut en stel geen medische diagnoses. Heb je klachten, een blessure of een medische aandoening, overleg dan eerst met je huisarts of behandelaar.",
          ],
        },
        {
          heading: "Tarieven, betaling en opzegging",
          body: [
            "Op deze website staan geen tarieven. Tijdens en na het gratis kennismakingsgesprek bespreek ik met jou welk tarief, welke betaalwijze en welke opzegtermijn op jouw traject van toepassing zijn.",
            "Deze afspraken worden pas bindend zodra ze schriftelijk zijn bevestigd, bijvoorbeeld per e-mail, zodat voor ons beiden duidelijk is waar we het over eens zijn.",
          ],
        },
        {
          heading: "Klachten en toepasselijk recht",
          body: [
            `Heb je een klacht, laat het me eerst zelf weten via ${contact.email}. Ik reageer binnen veertien dagen.`,
            "Op deze overeenkomst is Nederlands recht van toepassing. Je kunt een geschil ook voorleggen aan het Europese ODR-platform.",
          ],
        },
      ],
    };
  }

  return {
    title: "Terms and conditions",
    intro: `These terms apply to all coaching provided by KrachtigFit, in ${legal.address.city} and online.`,
    sections: [
      {
        heading: "Who I am",
        body: [
          `KrachtigFit, ${legal.address.city}, Netherlands. Chamber of Commerce ${legal.kvk}, VAT ID ${legal.btwId}. Reachable at ${contact.email} and ${contact.phoneDisplay}.`,
        ],
      },
      {
        heading: `${siteConfig.withdrawalPeriodDays}-day cooling-off period`,
        body: [
          `Coaching purchased through this website is a distance contract, so you have ${siteConfig.withdrawalPeriodDays} days to withdraw, counted from the moment the agreement is concluded. No reason is required.`,
          "If you want coaching to begin within that period, I will ask you to confirm that explicitly. Your right to withdraw only lapses once the service has been fully performed — which, for a programme running several weeks, never happens during the cooling-off period.",
          "If you withdraw during that period you pay only pro rata for what has already been delivered. The remainder is refunded within fourteen days.",
          `Withdrawal is informal — an email to ${contact.email} is enough. The statutory model withdrawal form is available on request.`,
        ],
      },
      {
        heading: "What I provide, and what I don't",
        body: [
          "I provide coaching: a training programme, feedback on your food log and periodic check-ins. I will work to help you reach your goal, but I cannot guarantee a specific outcome — that depends partly on factors outside my control.",
          "I am not a doctor or physiotherapist and do not make medical diagnoses. If you have pain, an injury or a medical condition, consult your GP or treating clinician first.",
        ],
      },
      {
        heading: "Pricing, payment and cancellation",
        body: [
          "No prices are published on this website. During and after the free intro call, we discuss the rate, payment method and notice period that apply to your programme.",
          "These terms only become binding once confirmed in writing, for example by email, so both of us are clear on what's been agreed.",
        ],
      },
      {
        heading: "Complaints and governing law",
        body: [
          `If you have a complaint, please raise it with me first at ${contact.email}. I respond within fourteen days.`,
          "Dutch law applies to this agreement. You may also refer a dispute to the European ODR platform.",
        ],
      },
    ],
  };
}

export function cookiePolicy(locale: Locale): LegalDoc {
  if (locale === "nl") {
    return {
      title: "Cookiebeleid",
      intro:
        "Kort: deze website plaatst geen cookies zonder dat je daar zelf voor kiest.",
      sections: [
        {
          heading: "Geen automatische tracking",
          body: [
            "Er draaien standaard geen analytics-, advertentie- of social-mediascripts op deze site. Er is dus ook geen cookiebanner nodig voor wat automatisch laadt, want daar valt niets te weigeren.",
          ],
        },
        {
          heading: "Wat er wel gebeurt",
          body: [
            "Lettertypen worden vanaf deze website zelf geserveerd. Er gaat geen verzoek naar een externe lettertypeserver.",
            "Het contactformulier gebruikt Cloudflare Turnstile tegen spam. Turnstile plaatst geen cookies en volgt je niet over websites heen.",
            "De hostingprovider houdt technische serverlogs bij voor beveiliging en foutopsporing. Die logs zijn niet gekoppeld aan een profiel.",
          ],
        },
        {
          heading: "Instagram-feed op verzoek",
          body: [
            "Bij 'Ervaringen' kun je op een knop klikken om onze Instagram-feed te bekijken, geleverd door Common Ninja. Deze feed laadt niet automatisch — het script wordt pas opgehaald op het moment dat je zelf op de knop klikt.",
            "Zodra je de feed laadt, kunnen Common Ninja en Instagram/Meta cookies of vergelijkbare technieken plaatsen waar wij geen controle over hebben. Liever niet? Bezoek onze Instagram-pagina dan rechtstreeks via de link op de site — dat laadt niets op deze pagina.",
          ],
        },
        {
          heading: "Als er meer bijkomt",
          body: [
            "Zodra er andere meetsoftware of een externe agenda-integratie bijkomt, wordt dit beleid aangepast en wordt ook daar pas toestemming voor gevraagd voordat zulke scripts laden.",
          ],
        },
      ],
    };
  }

  return {
    title: "Cookie policy",
    intro: "In short: this website sets no cookies without you choosing to.",
    sections: [
      {
        heading: "No automatic tracking",
        body: [
          "No analytics, advertising or social media scripts run on this site by default. No cookie banner is needed for what loads automatically, because there is nothing to decline.",
        ],
      },
      {
        heading: "What does happen",
        body: [
          "Fonts are served from this website itself. No request goes to an external font server.",
          "The contact form uses Cloudflare Turnstile for spam protection. Turnstile sets no cookies and does not track you across sites.",
          "The hosting provider keeps technical server logs for security and debugging. Those logs are not linked to a profile.",
        ],
      },
      {
        heading: "Instagram feed, on request",
        body: [
          "Under 'Experiences' you can click a button to view our Instagram feed, provided by Common Ninja. This feed does not load automatically — the script is only fetched the moment you click the button yourself.",
          "Once you load the feed, Common Ninja and Instagram/Meta may set cookies or similar technology that we have no control over. Would rather not? Visit our Instagram page directly via the link on the site instead — that loads nothing on this page.",
        ],
      },
      {
        heading: "If more is added",
        body: [
          "If other measurement software or an external calendar integration is added later, this policy will be updated and consent will likewise be requested before such scripts load.",
        ],
      },
    ],
  };
}
