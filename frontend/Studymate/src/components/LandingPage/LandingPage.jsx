import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Sparkles, 
  ArrowRight, 
  PlayCircle, 
  FileUp, 
  LayoutList, 
  TrendingUp, 
  Trophy, 
  Clock, 
  Lock 
} from 'lucide-react';
import './LandingPage.scss';


const features = [
  { 
    icon: FileUp,      
    title: 'Upload any document',    
    desc: 'Drop in your PDFs, StudyMate handles the formatting automatically.' 
  },
  { 
    icon: LayoutList,  
    title: 'AI-generated flashcards', 
    desc: 'Our engine extracts key concepts and creates high-yield active recall decks instantly.' 
  },
  { 
    icon: TrendingUp,  
    title: 'Track your progress',    
    desc: 'Monitor your retention over time with detailed analytics and daily streak tracking.' 
  },
  { 
    icon: Trophy,      
    title: 'Quizzes & testing',      
    desc: 'Challenge yourself with adaptive practice tests generated straight from your syllabus.' 
  },
  { 
    icon: Clock,       
    title: 'Study on your schedule', 
    desc: 'Access your personalized library 24/7 on any device, exactly when you need it.' 
  },
  { 
    icon: Lock,        
    title: 'Private & secure',       
    desc: 'Your study materials, notes, and academic data are fully encrypted and kept private.' 
  },
];

const steps = [
  {
    num: '1',
    title: 'Upload your material',
    desc: 'Drop in any PDF, from your course.',
  },
  {
    num: '2',
    title: 'AI builds your deck',
    desc: 'StudyMate reads and generates a full flashcard set in seconds.',
  },
  {
    num: '3',
    title: 'Study & review',
    desc: 'Flip cards, take quizzes, and track what you know.',
  },
  {
    num: '4',
    title: 'Ace your exam',
    desc: 'Go in confident — you have covered everything that matters.',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">

      {/* ── NAV ── */}
      <nav className="landing-page__nav">
        <div className="landing-page__nav-inner">
          <div className="landing-page__logo">
            <div className="landing-page__logo-icon">
            
              <Brain size={22} color="#ffffff" strokeWidth={2.5} />
            </div>
            <span className="landing-page__logo-text">StudyMate</span>
          </div>

          <div className="landing-page__nav-links">
            <button className="btn-ghost" onClick={() => navigate('/login')}>
              Log in
            </button>
            <button className="btn-primary" onClick={() => navigate('/register')}>
              Get started
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="landing-page__hero">
        <div className="landing-page__badge">
          
          <Sparkles size={16} strokeWidth={2.5} />
          AI-powered learning, built for students
        </div>

        <h1 className="landing-page__title">
          Welcome to <span>StudyMate</span> —<br />
          study smarter, not harder
        </h1>

        <p className="landing-page__subtitle">
          Upload your notes, textbooks, or slides and let AI transform them into
          interactive flashcards. Master any subject at your own pace.
        </p>

        <div className="landing-page__cta">
          <button
            className="btn-lg btn-lg--primary"
            onClick={() => navigate('/register')}
          >
            Get started — it's free
        
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
          <button
            className="btn-lg btn-lg--outline"
            onClick={() => navigate('/login')}
          >
          
            <PlayCircle size={18} strokeWidth={2.5} />
            Log in
          </button>
        </div>

        <div className="landing-page__stats">
          <div className="landing-page__stat">
            <div className="landing-page__stat-num">10k+</div>
            <div className="landing-page__stat-label">Students using StudyMate</div>
          </div>
          <div className="landing-page__stat">
            <div className="landing-page__stat-num">500k+</div>
            <div className="landing-page__stat-label">Flashcards generated</div>
          </div>
          <div className="landing-page__stat">
            <div className="landing-page__stat-num">95%</div>
            <div className="landing-page__stat-label">Say it improved their grades</div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="landing-page__features">
        <p className="landing-page__section-label">Why StudyMate</p>
        <h2 className="landing-page__section-title">
          Everything you need to ace your studies
        </h2>
        <p className="landing-page__section-sub">
          From document upload to exam day — StudyMate covers every step of your
          learning journey.
        </p>

        <div className="landing-page__feature-grid">
          
          {features.map((f, index) => (
            <div className="landing-page__feature-card" key={index}>
              <div className="landing-page__feat-icon">
                <f.icon size={26} strokeWidth={2.5} />
              </div>
              <h3 className="landing-page__feat-title">{f.title}</h3>
              <p className="landing-page__feat-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="landing-page__how">
        <p className="landing-page__section-label">How it works</p>
        <h2 className="landing-page__section-title">
          From document to flashcard in seconds
        </h2>
        <p className="landing-page__section-sub">
          Three simple steps is all it takes to start studying smarter.
        </p>

        <div className="landing-page__steps">
          {steps.map((s, index) => (
            <div className="landing-page__step" key={index}>
              <div className="landing-page__step-num">{s.num}</div>
              <h3 className="landing-page__step-title">{s.title}</h3>
              <p className="landing-page__step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="landing-page__cta-banner">
        <div className="landing-page__cta-banner-inner">
          <h2>Ready to study smarter?</h2>
          <p>Join thousands of students already using StudyMate to get ahead.</p>
          <button className="btn-white" onClick={() => navigate('/register')}>
            Create your free account
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-page__footer">
        &copy; {new Date().getFullYear()} <span>StudyMate</span> · Built to help you learn better
      </footer>

    </div>
  );
};

export default LandingPage;