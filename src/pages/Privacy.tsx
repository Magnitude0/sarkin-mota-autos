import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { WhatsAppIcon } from "@/components/site/icons";
import { PHONE_DISPLAY, WA_GENERAL } from "@/lib/site";

const SECTIONS = [
  {
    title: "1. Who We Are",
    body: "Sarkin Mota Autos (“we”, “us”, “our”) is a premium foreign used machine dealership based at Olusegun Obasanjo Way, beside NNPC Mega Station, Central Business District, Abuja, Nigeria. We operate the website sarkinmota.com and related WhatsApp and social channels.",
  },
  {
    title: "2. What Data We Collect",
    body: "We only collect the information you choose to give us through our enquiry forms: your name and phone number, plus the machine you are interested in and any message you send. We never collect payment card details, location tracking, or data from your device.",
  },
  {
    title: "3. How We Use It",
    body: "Your details are used exclusively to respond to your enquiry and, where relevant, to progress a potential sale — including contacting you by phone or WhatsApp about the machine you asked about. We do not sell, rent or trade your information to any third party.",
  },
  {
    title: "4. Storage",
    body: "Enquiries are stored securely in our database with restricted access limited to authorised Sarkin Mota Autos personnel. Reasonable technical and organisational measures — including access controls — are used to protect your data from unauthorised access, alteration or destruction.",
  },
  {
    title: "5. Data Retention",
    body: "We keep enquiry records for a maximum of 12 months. After this period, records are deleted or anonymised unless a sale is in progress or a legal obligation requires otherwise.",
  },
  {
    title: "6. Your Rights",
    body: "You have the right to request access to the personal data we hold about you, request correction of inaccurate information, or request deletion of your data at any time. To exercise any of these rights, simply message us on WhatsApp or call the number below — we respond quickly.",
  },
  {
    title: "7. Cookies",
    body: "This website does not use tracking cookies or advertising pixels. We use your browser's local storage only for lightweight features such as machines you have saved (hearted) on your device. You can clear this at any time through your browser settings.",
  },
  {
    title: "8. NDPA 2023 Compliance",
    body: "We comply with the Nigeria Data Protection Act 2023 (NDPA) and the associated regulations. Our processing activities are based on your consent (which you give when submitting an enquiry) and our legitimate interest in responding to you. You may withdraw consent at any time.",
  },
  {
    title: "9. Contact for Data Queries",
    body: "For any questions about this policy or your personal data, contact our data representative: Aliyu Mohammad — WhatsApp " + PHONE_DISPLAY + ", or visit the showroom in Abuja during opening hours (Mon–Sat, 8AM–6PM).",
  },
];

export default function Privacy() {
  return (
    <SiteLayout>
      <PageHero
        label="Privacy Policy"
        title={
          <>
            Your Data, <span className="text-gold">Protected</span>
          </>
        }
        sub="We collect the minimum we need to serve you — and nothing more. Last updated: August 2026."
      />

      <section className="py-14 sm:py-20">
        <div className="container-site max-w-3xl">
          <div className="flex flex-col gap-8">
            {SECTIONS.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-white/10 bg-[#151517] p-6"
                style={{ transform: "none" }}
              >
                <h2 className="font-display text-lg font-extrabold text-gold">
                  {s.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#b8b8b8]">
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-[20px] border border-gold/25 bg-[#151515] p-8 text-center">
            <p className="font-display text-lg font-extrabold text-white">
              Questions about your data? <span className="text-gold">My Bratha.</span>
            </p>
            <a
              href={WA_GENERAL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa mt-5"
            >
              <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
