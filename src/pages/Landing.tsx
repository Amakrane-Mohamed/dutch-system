import { Wordmark } from '../components/Brand'

const route = (path: string) => `#${path}`

function GermanFlag() {
  return <span className="dl-flag" aria-label="علم ألمانيا"><i /><i /><i /></span>
}

export default function Landing() {
  return <div className="dl-page" dir="rtl">
    <header className="dl-header">
      <a href={route('/')} aria-label="RihlaDeutch، الصفحة الرئيسية"><Wordmark /></a>
      <nav aria-label="التنقّل الرئيسي">
        <a href="#course">المسار</a>
        <a href="#how">كيفاش كتعلّم</a>
      </nav>
      <div className="dl-header-actions">
        <a className="dl-login" href={route('/login')}>عندي حساب</a>
        <a className="dl-button dl-button-small" href={route('/signup')}>بدا دابا</a>
      </div>
    </header>

    <main>
      <section className="dl-hero">
        <div className="dl-hero-copy">
          <div className="dl-kicker"><GermanFlag /> الألمانية بالدارجة المغربية</div>
          <h1>كل نهار شوية،<br /><span>حتى تهضر بالألمانية.</span></h1>
          <p>دروس قصيرة، شرح مفهوم بالدارجة، وتمارين من الحياة اليومية. بدا من الصفر وكمل خطوة بخطوة حتى B2.</p>
          <div className="dl-hero-actions">
            <a className="dl-button" href={route('/signup')}>بدا الرحلة ديالك</a>
            <a className="dl-secondary-link" href="#course">شوف المسار</a>
          </div>
          <div className="dl-proof-row"><span className="dl-check">✓</span><span>دروس كتقدر تكملها فوقت قصير</span><span className="dl-proof-divider" /><span>A1 → B2</span></div>
        </div>

        <div className="dl-hero-art">
          <div className="dl-art-orbit" aria-hidden="true" />
          <div className="dl-speech dl-speech-top" dir="ltr"><b>Hallo!</b><small>سلام!</small></div>
          <figure className="dl-photo"><img src="./hero-learners.jpg" alt="ولد وبنت فرحانين كيتعلّمو الألمانية مجموعين" /></figure>
          <div className="dl-lesson-chip"><span className="dl-sound-icon" aria-hidden="true">♫</span><span dir="ltr"><b>Guten Morgen</b><small>صباح الخير</small></span><span className="dl-chip-check">✓</span></div>
          <span className="dl-spark dl-spark-one" aria-hidden="true">✳</span>
          <span className="dl-spark dl-spark-two" aria-hidden="true">•</span>
        </div>
      </section>

      <section className="dl-course-section" id="course">
        <div className="dl-course-heading"><span>اختار المسار ديالك</span><h2>الألمانية، من الدارجة.</h2></div>
        <a className="dl-course-card" href={route('/signup')}>
          <div className="dl-course-flag"><GermanFlag /></div>
          <span className="dl-course-title"><b>الألمانية</b><small>شرح وتمارين بالدارجة المغربية</small></span>
          <span className="dl-levels"><b>A1</b><i /> <b>A2</b><i /> <b>B1</b><i /> <b>B2</b></span>
          <span className="dl-course-cta">بدا التعلّم</span>
        </a>
        <p className="dl-course-note">بدا من اللول، ولا دخل للمرحلة اللي مناسبة ليك.</p>
      </section>

      <section className="dl-benefits" id="how">
        <div className="dl-benefits-heading"><div><span>علاش RihlaDeutch؟</span><h2>القراية اللي كتلقى وقت ليها، كتكمّل فيها.</h2></div><p>كلشي اللي تحتاجو باش تبدا من الصفر، وتعرف شنو تدير من بعد.</p></div>
        <div className="dl-benefit-window" role="region" aria-label="مزايا التعلّم مع رِحلة">
          <div className="dl-benefit-track">
            <div className="dl-benefit-set">
              <article className="dl-benefit-card benefit-yellow"><span className="dl-benefit-icon">Aa</span><small>الشرح</small><h3>بالدارجة ديالك</h3><p>القواعد كتولي مفهومة ملي كتشرح بأمثلة كتستعملها كل نهار.</p></article>
              <article className="dl-benefit-card benefit-red"><span className="dl-benefit-icon">✓</span><small>التمرين</small><h3>جمل من نهارك</h3><p>تدرّب على المواعيد، القراية، الخدمة، والهضرة مع الناس.</p></article>
              <article className="dl-benefit-card benefit-white"><span className="dl-benefit-icon">W</span><small>المراجعة</small><h3>كلماتك ما كتضيعش</h3><p>جمع الكلمات اللي قريتي، ورجع ليهم وقت ما بغيتي.</p></article>
              <article className="dl-benefit-card benefit-black"><span className="dl-benefit-icon">B2</span><small>المسار</small><h3>عارف الخطوة الجاية</h3><p>مراحل واضحة من A1 حتى B2، بلا ما تبقى محتار شنو تقرا.</p></article>
            </div>
            <div className="dl-benefit-set" aria-hidden="true">
              <article className="dl-benefit-card benefit-yellow"><span className="dl-benefit-icon">Aa</span><small>الشرح</small><h3>بالدارجة ديالك</h3><p>القواعد كتولي مفهومة ملي كتشرح بأمثلة كتستعملها كل نهار.</p></article>
              <article className="dl-benefit-card benefit-red"><span className="dl-benefit-icon">✓</span><small>التمرين</small><h3>جمل من نهارك</h3><p>تدرّب على المواعيد، القراية، الخدمة، والهضرة مع الناس.</p></article>
              <article className="dl-benefit-card benefit-white"><span className="dl-benefit-icon">W</span><small>المراجعة</small><h3>كلماتك ما كتضيعش</h3><p>جمع الكلمات اللي قريتي، ورجع ليهم وقت ما بغيتي.</p></article>
              <article className="dl-benefit-card benefit-black"><span className="dl-benefit-icon">B2</span><small>المسار</small><h3>عارف الخطوة الجاية</h3><p>مراحل واضحة من A1 حتى B2، بلا ما تبقى محتار شنو تقرا.</p></article>
            </div>
          </div>
        </div>
        <p className="dl-benefit-hint">حرّك على المزايا باش تشوفهم كاملين</p>
      </section>

      <section className="dl-testimonials">
        <div className="dl-testimonials-heading"><span>تجارب المتعلمين</span><h2>كل واحد عندو بداية مختلفة.</h2><p>أمثلة تجريبية باش نبيّنو شكل القسم؛ نبدّلوها بكلام متعلمين حقيقيين منين تجمعوه.</p></div>
        <div className="dl-testimonial-grid">
          <article className="dl-testimonial-card"><span className="dl-quote-mark">“</span><p>بديت من الصفر، ودابا وليت كنركّب جمل بسيطة بلا ما نوقف عند كل كلمة.</p><div><span className="dl-testimonial-avatar portrait-one" role="img" aria-label="رسمة توضيحية لمتعلّمة" /><span><b>متعلّمة</b><small>مثال تجريبي</small></span></div></article>
          <article className="dl-testimonial-card testimonial-featured"><span className="dl-quote-mark">“</span><p>الشرح بالدارجة خلّاني نفهم علاش الفعل كيتبدل فالجملة، ماشي غير نحفظو.</p><div><span className="dl-testimonial-avatar portrait-two" role="img" aria-label="رسمة توضيحية لمتعلّم" /><span><b>متعلّم</b><small>مثال تجريبي</small></span></div></article>
          <article className="dl-testimonial-card"><span className="dl-quote-mark">“</span><p>كنراجع الكلمات فطريقي للقراية، وكنعرف شنو خاصني نكمل ملي كنرجع.</p><div><span className="dl-testimonial-avatar portrait-three" role="img" aria-label="رسمة توضيحية لمتعلّمة" /><span><b>متعلّمة</b><small>مثال تجريبي</small></span></div></article>
        </div>
      </section>

      <section className="dl-goals">
        <div className="dl-goals-copy"><span>خطة مكثّفة، خطوة بخطوة</span><h2>خلّي عندك هدف كبير.<br /><em>وقرّب ليه كل نهار.</em></h2><p>هدف الرحلة: B2 فـ6 شهور، وC1 فـ8 شهور مع استمرار الدراسة والممارسة.</p><a className="dl-button" href={route('/signup')}>بدا المسار ديالك</a></div>
        <div className="dl-timeline" aria-label="أهداف التعلّم: B2 في الشهر السادس وC1 في الشهر الثامن">
          <div className="dl-timeline-item"><span className="dl-timeline-dot">01</span><div><small>الشهر 1–2</small><b>A1 · A2</b><span>أساسيات وتواصل يومي</span></div></div>
          <div className="dl-timeline-item"><span className="dl-timeline-dot">02</span><div><small>الشهر 3–4</small><b>B1</b><span>هضرة وقراية باستقلالية</span></div></div>
          <div className="dl-timeline-item dl-timeline-highlight"><span className="dl-timeline-dot">03</span><div><small>الهدف · الشهر 6</small><b>B2</b><span>تواصل مزيان فمواقف مختلفة</span></div></div>
          <div className="dl-timeline-item dl-timeline-advanced"><span className="dl-timeline-dot">04</span><div><small>الهدف · الشهر 8</small><b>C1</b><span>مرحلة متقدمة من بعد B2</span></div></div>
          <p className="dl-goals-note">هاد المدد أهداف لخطة مكثّفة وماشي ضمان. النتيجة كتتبدل حسب المستوى ديالك، الوقت اللي كتخصّص للقراية، والممارسة. مسار رحلة الحالي كيوصل حتى B2؛ الوصول لـC1 كيتطلب محتوى متقدم من بعد هاد المرحلة.</p>
        </div>
      </section>

      <section className="dl-bottom-cta">
        <div><span>من أول كلمة كيبدا الطريق</span><h2>واش واجد تبدا؟</h2></div>
        <a className="dl-button" href={route('/signup')}>دير حسابك</a>
      </section>
    </main>

    <footer className="dl-footer">
      <div className="dl-footer-main"><a href={route('/')}><Wordmark dark /></a><p>الألمانية كتبدأ بكلمة. RihlaDeutch يعاونك تكملها بالدارجة ديالك.</p></div>
      <div className="dl-footer-column"><b>التعلّم</b><a href="#course">مسار الألمانية</a><a href="#how">مزايا RihlaDeutch</a></div>
      <div className="dl-footer-column"><b>الحساب</b><a href={route('/signup')}>دير حساب</a><a href={route('/login')}>دخول المتعلّمين</a></div>
      <div className="dl-footer-bottom"><span>© {new Date().getFullYear()} RihlaDeutch</span><span>تعلّم الألمانية بالدارجة المغربية</span></div>
    </footer>
  </div>
}
