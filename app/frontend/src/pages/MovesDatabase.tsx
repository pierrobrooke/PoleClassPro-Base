import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, ExternalLink, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { fetchMoves, type PoleMove } from '@/lib/movesApi';

const levelColors: Record<string, string> = {
  beginner: 'bg-coral/15 text-coral border-coral/30',
  intermediate: 'bg-lavender/15 text-lavender border-lavender/30',
  advanced: 'bg-ocean/15 text-ocean border-ocean/30',
  expert: 'bg-gold/15 text-gold border-gold/30',
};

function getLevelColorClass(level: string): string {
  const key = level.toLowerCase().trim();
  return levelColors[key] || 'bg-[#283241] text-[#B8C0CC] border-[rgba(184,192,204,0.14)]';
}

const categoryColors: Record<string, string> = {
  spin: 'bg-lavender/15 text-lavender border-lavender/30',
  static: 'bg-ocean/15 text-ocean border-ocean/30',
  transition: 'bg-gold/15 text-gold border-gold/30',
  floorwork: 'bg-coral/15 text-coral border-coral/30',
  climb: 'bg-ocean/15 text-ocean border-ocean/30',
  invert: 'bg-lavender/15 text-lavender border-lavender/30',
  'sit / hold': 'bg-ocean/15 text-ocean border-ocean/30',
  combo: 'bg-coral/15 text-coral border-coral/30',
  trick: 'bg-gold/15 text-gold border-gold/30',
  edgework: 'bg-ocean/15 text-ocean border-ocean/30',
  kip: 'bg-gold/15 text-gold border-gold/30',
};

function getCategoryColorClass(category: string): string {
  const key = category.toLowerCase().trim();
  return categoryColors[key] || 'bg-[#283241] text-[#B8C0CC] border-[rgba(184,192,204,0.14)]';
}

export default function MovesDatabase() {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [moves, setMoves] = useState<PoleMove[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMove, setSelectedMove] = useState<PoleMove | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMoves() {
      try {
        setLoading(true);
        setError(null);

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out')), 15000)
        );

        const result = await Promise.race([fetchMoves(), timeoutPromise]);
        if (!cancelled) {
          setMoves(result);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          setError(`Could not load moves: ${message}`);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMoves();
    return () => { cancelled = true; };
  }, []);

  // Derive unique levels from live data
  const levels = useMemo(() => {
    const set = new Set<string>();
    moves.forEach((m) => { if (m.level) set.add(m.level); });
    return Array.from(set).sort();
  }, [moves]);

  // Derive unique categories from array columns
  const categories = useMemo(() => {
    const set = new Set<string>();
    moves.forEach((m) => {
      if (Array.isArray(m.category)) {
        m.category.forEach((c) => { if (c) set.add(c); });
      }
    });
    return Array.from(set).sort();
  }, [moves]);

  const filteredMoves = useMemo(() => {
    return moves.filter((move) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        move.move_name?.toLowerCase().includes(searchLower) ||
        move.teaching_cues?.toLowerCase().includes(searchLower) ||
        move.body_position?.toLowerCase().includes(searchLower) ||
        (Array.isArray(move.tags) && move.tags.some((t) => t.toLowerCase().includes(searchLower)));
      const matchesLevel = levelFilter === 'all' || move.level === levelFilter;
      const matchesCategory =
        categoryFilter === 'all' ||
        (Array.isArray(move.category) && move.category.includes(categoryFilter));
      return matchesSearch && matchesLevel && matchesCategory;
    });
  }, [moves, search, levelFilter, categoryFilter]);

  return (
    <div className="min-h-screen bg-[#151A22]">
      <Navigation />

      {/* Hero */}
      <div className="relative bg-[#1E2530] border-b border-[rgba(184,192,204,0.14)] py-16 overflow-hidden">
        <div className="relative container mx-auto px-4">
          <p className="font-mono text-sm text-ocean tracking-wide uppercase mb-2">Knowledge Graph</p>
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-[#F7F4EF] mb-2">Movement Database</h1>
          <p className="font-body text-[#B8C0CC] text-lg">
            Browse and discover {moves.length > 0 ? `${moves.length} ` : ''}interconnected pole moves
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search moves by name, tags, body position..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 font-body"
            />
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-full md:w-48 font-body">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {levels.map((lvl) => (
                <SelectItem key={lvl} value={lvl}>
                  {lvl} ({moves.filter((m) => m.level === lvl).length})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48 font-body">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat} ({moves.filter((m) => Array.isArray(m.category) && m.category.includes(cat)).length})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="secondary" className="font-body">
            {filteredMoves.length} moves found
          </Badge>
          {levelFilter !== 'all' && (
            <Badge className={`font-body ${getLevelColorClass(levelFilter)}`}>{levelFilter}</Badge>
          )}
          {categoryFilter !== 'all' && (
            <Badge className={`font-body ${getCategoryColorClass(categoryFilter)}`}>{categoryFilter}</Badge>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-ocean" />
              <span className="ml-3 sr-only">Loading</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse bg-[#1E2530] border-[rgba(184,192,204,0.14)]">
                  <CardHeader className="pb-2">
                    <div className="h-5 bg-[#283241] rounded w-3/4" />
                    <div className="flex gap-2 mt-2">
                      <div className="h-5 bg-[#283241] rounded w-16" />
                      <div className="h-5 bg-[#283241] rounded w-20" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-[#283241] rounded w-full mt-1" />
                    <div className="h-4 bg-[#283241] rounded w-2/3 mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-xl font-semibold">Unable to load moves</h3>
            <p className="font-body text-muted-foreground max-w-md mx-auto">
              There was an issue connecting to the database. Please check your connection and try again.
            </p>
            <p className="font-body text-xs text-muted-foreground">{error}</p>
          </div>
        )}

        {/* Moves Grid */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMoves.map((move) => (
              <Card
                key={move.id}
                onClick={() => setSelectedMove(move)}
                className="cursor-pointer bg-[#1E2530] border-[rgba(184,192,204,0.14)] card-hover"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="font-heading text-lg text-[#F7F4EF]">{move.move_name}</CardTitle>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {move.level && (
                      <Badge variant="outline" className={`text-xs ${getLevelColorClass(move.level)}`}>
                        {move.level}
                      </Badge>
                    )}
                    {Array.isArray(move.category) && move.category.map((cat) => (
                      <Badge key={cat} variant="outline" className={`text-xs ${getCategoryColorClass(cat)}`}>
                        {cat}
                      </Badge>
                    ))}
                    {Array.isArray(move.pole_type) && move.pole_type.map((pt) => (
                      <Badge key={pt} variant="outline" className="text-xs bg-[#283241] text-[#B8C0CC] border-[rgba(184,192,204,0.14)]">
                        {pt}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  {move.body_position && (
                    <p className="text-sm text-[#B8C0CC]">
                      <span className="font-medium text-[#F7F4EF]">Position:</span> {move.body_position}
                    </p>
                  )}
                  {Array.isArray(move.muscle_groups) && move.muscle_groups.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {move.muscle_groups.slice(0, 4).map((mg) => (
                        <Badge key={mg} variant="secondary" className="text-xs bg-[#283241] text-[#B8C0CC] border-[rgba(184,192,204,0.14)]">
                          {mg}
                        </Badge>
                      ))}
                      {move.muscle_groups.length > 4 && (
                        <Badge variant="secondary" className="text-xs bg-[#283241] text-[#B8C0CC]">
                          +{move.muscle_groups.length - 4}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && !error && filteredMoves.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-xl font-semibold">No moves found</h3>
            <p className="font-body text-muted-foreground max-w-md mx-auto">
              {moves.length === 0
                ? 'No moves are available in the database yet.'
                : 'No moves match your current filters. Try adjusting your search or filter criteria.'}
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedMove} onOpenChange={(open) => { if (!open) setSelectedMove(null); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-[#1E2530] border-[rgba(184,192,204,0.14)]">
          {selectedMove && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl text-[#F7F4EF]">{selectedMove.move_name}</DialogTitle>
              </DialogHeader>

              <div className="space-y-5 mt-4">
                {/* Badges Row */}
                <div className="flex flex-wrap gap-2">
                  {selectedMove.level && (
                    <Badge className={`${getLevelColorClass(selectedMove.level)}`}>
                      {selectedMove.level}
                    </Badge>
                  )}
                  {Array.isArray(selectedMove.category) && selectedMove.category.map((cat) => (
                    <Badge key={cat} className={`${getCategoryColorClass(cat)}`}>
                      {cat}
                    </Badge>
                  ))}
                  {Array.isArray(selectedMove.pole_type) && selectedMove.pole_type.map((pt) => (
                    <Badge key={pt} variant="outline" className="bg-[#283241] text-[#B8C0CC] border-[rgba(184,192,204,0.14)]">
                      {pt}
                    </Badge>
                  ))}
                  {selectedMove.body_position && (
                    <Badge variant="outline" className="bg-ocean/15 text-ocean border-ocean/30">
                      {selectedMove.body_position}
                    </Badge>
                  )}
                  {selectedMove.footwear && (
                    <Badge variant="outline" className="bg-gold/15 text-gold border-gold/30">
                      👟 {selectedMove.footwear}
                    </Badge>
                  )}
                  {selectedMove.skin_contact_required && (
                    <Badge variant="outline" className="bg-coral/15 text-coral border-coral/30">
                      Skin: {selectedMove.skin_contact_required}
                    </Badge>
                  )}
                </div>

                {/* Grip Types */}
                {Array.isArray(selectedMove.grip_type) && selectedMove.grip_type.length > 0 && (
                  <div>
                    <h4 className="font-heading font-semibold text-sm text-[#B8C0CC] mb-1.5">Grip Types</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMove.grip_type.map((gt) => (
                        <Badge key={gt} variant="outline" className="bg-ocean/15 text-ocean border-ocean/30">
                          {gt}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Muscle Groups */}
                {Array.isArray(selectedMove.muscle_groups) && selectedMove.muscle_groups.length > 0 && (
                  <div>
                    <h4 className="font-heading font-semibold text-sm text-[#B8C0CC] mb-1.5">Muscle Groups</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMove.muscle_groups.map((mg) => (
                        <Badge key={mg} variant="secondary" className="bg-[#283241] text-[#B8C0CC] border-[rgba(184,192,204,0.14)]">{mg}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skin Contact Body Parts */}
                {Array.isArray(selectedMove.skin_contact_body_part) && selectedMove.skin_contact_body_part.length > 0 && (
                  <div>
                    <h4 className="font-heading font-semibold text-sm text-[#B8C0CC] mb-1.5">Skin Contact Areas</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMove.skin_contact_body_part.map((bp) => (
                        <Badge key={bp} variant="outline" className="bg-coral/15 text-coral border-coral/30">
                          {bp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prerequisites */}
                {selectedMove.prerequisites && (
                  <div>
                    <h4 className="font-heading font-semibold text-sm text-muted-foreground mb-1">Prerequisites</h4>
                    <p className="text-foreground">{selectedMove.prerequisites}</p>
                  </div>
                )}

                {/* Teaching Cues */}
                {selectedMove.teaching_cues && (
                  <div>
                    <h4 className="font-heading font-semibold text-sm text-muted-foreground mb-1">Teaching Cues</h4>
                    <p className="text-foreground whitespace-pre-wrap">{selectedMove.teaching_cues}</p>
                  </div>
                )}

                {/* Common Mistakes */}
                {selectedMove.common_mistakes && (
                  <div>
                    <h4 className="font-heading font-semibold text-sm text-muted-foreground mb-1">Common Mistakes</h4>
                    <p className="text-foreground whitespace-pre-wrap">{selectedMove.common_mistakes}</p>
                  </div>
                )}

                {/* Safety Note */}
                {selectedMove.safety_note && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h4 className="font-heading font-semibold text-sm text-red-800 mb-1">⚠️ Safety Note</h4>
                    <p className="text-red-700 text-sm">{selectedMove.safety_note}</p>
                  </div>
                )}

                {/* Tags */}
                {Array.isArray(selectedMove.tags) && selectedMove.tags.length > 0 && (
                  <div>
                    <h4 className="font-heading font-semibold text-sm text-muted-foreground mb-1.5">Tags</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMove.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exit Moves */}
                {Array.isArray(selectedMove.exit_moves) && selectedMove.exit_moves.length > 0 && (
                  <div>
                    <h4 className="font-heading font-semibold text-sm text-muted-foreground mb-1.5">Exit Moves</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMove.exit_moves.map((em) => (
                        <Badge key={em} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          → {em}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Combo Starter & Curriculum Week */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-1.5">
                    {selectedMove.is_combo_starter ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm font-body">
                      {selectedMove.is_combo_starter ? 'Combo Starter' : 'Not a Combo Starter'}
                    </span>
                  </div>
                  {selectedMove.curriculum_week && (
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                        Week {selectedMove.curriculum_week}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Video Link */}
                {selectedMove.video_url && (
                  <div>
                    <a
                      href={selectedMove.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-orchid hover:text-orchid/80 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Watch Video Reference
                    </a>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}