import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Layers,
  Network,
  Compass,
  GraduationCap,
  BarChart3,
} from 'lucide-react';
import { Logo } from '@/components/Logo';

const features = [
  {
    icon: Network,
    title: 'Movement Knowledge Graph',
    description: 'Interconnected moves, entries, exits, and transitions — not just a list, but a living curriculum map.',
    accent: 'ocean',
  },
  {
    icon: Layers,
    title: 'Structured Progression',
    description: 'Pathway-coded levels from foundation to mastery. Every move has prerequisites, regressions, and advancement routes.',
    accent: 'coral',
  },
  {
    icon: Compass,
    title: 'Movement GPS™',
    description: 'Visual node graph connecting moves, combos, and pathways. See the relationships that make great classes.',
    accent: 'gold',
  },
  {
    icon: GraduationCap,
    title: 'Curriculum Design',
    description: 'Build structured class plans with teaching techniques, coaching cues, and progressive sequencing.',
    accent: 'lavender',
  },
  {
    icon: BookOpen,
    title: 'Teaching Intelligence',
    description: 'Proven pedagogical methods, safety protocols, and engagement strategies built into every plan.',
    accent: 'ocean',
  },
  {
    icon: BarChart3,
    title: 'AI Class Generator',
    description: 'Generate complete class plans powered by movement science and your curriculum database.',
    accent: 'coral',
  },
];

const accentColors: Record<string, string> = {
  ocean: '#73D9D6',
  coral: '#FF8F7A',
  gold: '#FFC870',
  lavender: '#B8B3FF',
};

export default function Index() {
  return (
    <div className="min-h-screen bg-navy">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#151A22]">
        {/* Constellation background */}
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-40" viewBox="0 0 1200 700" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Connection lines */}
            <line x1="200" y1="400" x2="350" y2="280" stroke="#FF8F7A" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
            <line x1="350" y1="280" x2="520" y2="340" stroke="#FF8F7A" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
            <line x1="520" y1="340" x2="680" y2="220" stroke="#73D9D6" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            <line x1="680" y1="220" x2="850" y2="160" stroke="#73D9D6" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            <line x1="520" y1="340" x2="750" y2="380" stroke="#FFC870" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
            <line x1="750" y1="380" x2="900" y2="300" stroke="#B8B3FF" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
            <line x1="900" y1="300" x2="1050" y2="250" stroke="#B8B3FF" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
            <line x1="350" y1="280" x2="400" y2="150" stroke="#B8B3FF" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
            <line x1="680" y1="220" x2="750" y2="380" stroke="#FFC870" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
            {/* Nodes */}
            <circle cx="200" cy="400" r="8" fill="#FF8F7A" className="animate-node-pulse" style={{ animationDelay: '0s' }} />
            <circle cx="350" cy="280" r="6" fill="#FF8F7A" className="animate-node-pulse" style={{ animationDelay: '0.5s' }} />
            <circle cx="520" cy="340" r="10" fill="#73D9D6" className="animate-node-pulse" style={{ animationDelay: '1s' }} />
            <circle cx="680" cy="220" r="7" fill="#73D9D6" className="animate-node-pulse" style={{ animationDelay: '1.5s' }} />
            <circle cx="850" cy="160" r="9" fill="#73D9D6" className="animate-node-pulse" style={{ animationDelay: '2s' }} />
            <circle cx="750" cy="380" r="6" fill="#FFC870" className="animate-node-pulse" style={{ animationDelay: '0.8s' }} />
            <circle cx="900" cy="300" r="7" fill="#B8B3FF" className="animate-node-pulse" style={{ animationDelay: '1.2s' }} />
            <circle cx="1050" cy="250" r="5" fill="#B8B3FF" className="animate-node-pulse" style={{ animationDelay: '1.8s' }} />
            <circle cx="400" cy="150" r="5" fill="#B8B3FF" className="animate-node-pulse" style={{ animationDelay: '2.2s' }} />
          </svg>
        </div>

        <div className="relative container mx-auto px-4 py-28 md:py-40">
          <div className="max-w-3xl">
            <div className="mb-10">
              <Logo width={240} height={52} variant="light" />
            </div>
            <div className="inline-flex items-center gap-2 bg-ocean/10 border border-ocean/25 rounded-full px-4 py-1.5 mb-6">
              <Network className="h-4 w-4 text-ocean" />
              <span className="text-sm font-mono text-ocean">Movement Intelligence Platform™</span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-extrabold text-ivory-text mb-6 leading-[1.05]">
              Structured Visual{' '}
              <span className="bg-gradient-to-r from-coral to-gold bg-clip-text text-transparent">
                Movement Education
              </span>
            </h1>
            <p className="font-body text-lg md:text-xl text-[#B8C0CC] mb-10 leading-relaxed max-w-2xl">
              The curriculum design platform for movement educators. Build structured, 
              progressive class plans powered by a Movement Knowledge Graph — not just 
              a move library, but an interconnected education system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="gradient-coral-gold text-navy font-heading font-bold px-8 gap-2 hover:opacity-90 transition-opacity"
                >
                  Start Building Curriculum
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/moves">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-ocean/40 text-ocean hover:bg-ocean/10 !bg-transparent !hover:bg-ocean/10 font-heading px-8"
                >
                  Explore Knowledge Graph
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Positioning Statement */}
      <section className="bg-[#1E2530] border-y border-[rgba(184,192,204,0.14)] py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="font-mono text-sm text-[#B8C0CC] tracking-wide uppercase mb-4">
            Why PoleClass Pro
          </p>
          <h2 className="font-heading text-2xl md:text-3xl text-ivory-text font-bold max-w-3xl mx-auto leading-snug">
            Your database is not a move library — it&apos;s a{' '}
            <span className="text-ocean">Movement Knowledge Graph</span>.
            Move → Entry → Function → Transition → Polish creates{' '}
            <span className="text-coral">relationships</span>, not lists.
          </h2>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-[#151A22] py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="font-mono text-sm text-ocean tracking-wide uppercase mb-3">
              Platform Capabilities
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-ivory-text font-bold">
              Built for Movement Educators
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              const color = accentColors[feature.accent];
              return (
                <Card
                  key={feature.title}
                  className="bg-[#1E2530] border-[rgba(184,192,204,0.14)] card-hover group"
                >
                  <CardContent className="p-6">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <IconComponent className="h-6 w-6" style={{ color }} />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-ivory-text mb-2 group-hover:text-ocean transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-[#B8C0CC] text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Educational Framework */}
      <section className="bg-[#1E2530] py-24 border-t border-[rgba(184,192,204,0.14)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="font-mono text-sm text-coral tracking-wide uppercase mb-3">
              Educational Framework
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-ivory-text font-bold">
              From Competency to Mastery
            </h2>
            <p className="text-[#B8C0CC] mt-4 max-w-2xl mx-auto">
              Most fitness systems stop at competency. Our framework extends into mastery — 
              presence, expression, performance, and connection.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
            {[
              { step: '1', label: 'Learn Move', color: '#FF8F7A' },
              { step: '2', label: 'Learn Function', color: '#FFC870' },
              { step: '3', label: 'Learn Transition', color: '#B8B3FF' },
              { step: '4', label: 'Integration', color: '#73D9D6' },
              { step: '5', label: 'Polish & Mastery', color: '#73D9D6' },
            ].map((item, idx) => (
              <div key={item.step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-navy font-heading font-bold text-lg"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.step}
                  </div>
                  <span className="text-xs text-[#B8C0CC] mt-2 font-mono text-center whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
                {idx < 4 && (
                  <div className="hidden md:block w-12 h-px bg-[rgba(184,192,204,0.3)] mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#151A22] py-24 border-t border-[rgba(184,192,204,0.14)]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl text-ivory-text font-bold mb-4">
            Ready to Transform Your Teaching?
          </h2>
          <p className="text-[#B8C0CC] text-lg mb-8 max-w-xl mx-auto">
            Join movement educators building structured, progressive curriculum 
            with intelligence — not guesswork.
          </p>
          <Link to="/dashboard">
            <Button
              size="lg"
              className="gradient-coral-gold text-navy font-heading font-bold px-10 py-6 text-lg gap-2 hover:opacity-90 transition-opacity"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <p className="font-mono text-xs text-[#B8C0CC]/60 mt-6">
            Structured Visual Movement Education™
          </p>
        </div>
      </section>
    </div>
  );
}