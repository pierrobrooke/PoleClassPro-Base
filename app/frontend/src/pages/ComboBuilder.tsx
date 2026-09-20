import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navigation } from '@/components/Navigation';
import {
  Plus,
  X,
  ArrowRight,
  Trash2,
  Save,
  Check,
  List,
  GripVertical,
  ChevronsUp,
  ChevronUp,
  ChevronDown,
  ChevronsDown,
  Share2,
  Copy,
  FileText,
  Link2,
  Search,
} from 'lucide-react';
import { useNotionMoves } from '@/hooks/useNotionMoves';
import { NotionMove } from '@/hooks/useNotionMoves';
import { createClient } from '@metagptx/web-sdk';

const client = createClient();

interface SavedCombo {
  id: string;
  name: string;
  moves: NotionMove[];
  savedAt: string;
}

function getLevelBadgeClasses(level: string | undefined | null): string {
  const normalized = (level || '').toLowerCase();
  if (normalized.includes('beginner')) return 'bg-green-100 text-green-800 border-green-300';
  if (normalized.includes('intermediate')) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  if (normalized.includes('advanced')) return 'bg-orange-100 text-orange-800 border-orange-300';
  if (normalized.includes('expert')) return 'bg-red-100 text-red-800 border-red-300';
  return 'bg-gray-100 text-gray-800 border-gray-300';
}

export default function ComboBuilder() {
  const { moves, loading, error, levels, categories } = useNotionMoves();

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Combo state
  const [combo, setCombo] = useState<NotionMove[]>([]);
  const [comboName, setComboName] = useState('');
  const [savedCombos, setSavedCombos] = useState<SavedCombo[]>([]);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Combo saved');
  const saveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Share modal state
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [shareCopied, setShareCopied] = useState(false);
  const [instructorName, setInstructorName] = useState('');
  const [shareDescription, setShareDescription] = useState('');
  const [exportText, setExportText] = useState('');

  // Drag and drop state - using useState for visual feedback
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragItemRef = useRef<number | null>(null);

  // Filtered moves
  const filteredMoves = moves.filter((move) => {
    const matchesSearch = !searchQuery || move.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'all' || move.level === filterLevel;
    const matchesCategory = filterCategory === 'all' || move.category === filterCategory;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  // Load saved combos on mount
  useEffect(() => {
    const saved = localStorage.getItem('poleDanceSavedCombos');
    if (saved) {
      try {
        setSavedCombos(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
    const currentCombo = localStorage.getItem('poleDanceCurrentCombo');
    if (currentCombo) {
      try {
        const data = JSON.parse(currentCombo);
        if (data.moves) setCombo(data.moves);
        if (data.name) setComboName(data.name);
      } catch {
        // ignore
      }
    }
    const savedName = localStorage.getItem('poleDanceInstructorName');
    if (savedName) setInstructorName(savedName);
  }, []);

  const autoSave = useCallback(() => {
    if (combo.length === 0 && !comboName) return;
    const currentCombo = { name: comboName, moves: combo };
    localStorage.setItem('poleDanceCurrentCombo', JSON.stringify(currentCombo));
    setToastMessage('Combo saved');
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2000);
  }, [combo, comboName]);

  // Auto-save every 20 seconds
  useEffect(() => {
    saveTimerRef.current = setInterval(() => {
      autoSave();
    }, 20000);
    return () => {
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
    };
  }, [autoSave]);

  const addToCombo = (move: NotionMove) => {
    setCombo((prev) => [...prev, move]);
  };

  const removeFromCombo = (index: number) => {
    setCombo((prev) => prev.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setCombo((prev) => {
      const newCombo = [...prev];
      [newCombo[index - 1], newCombo[index]] = [newCombo[index], newCombo[index - 1]];
      return newCombo;
    });
  };

  const moveDown = (index: number) => {
    if (index === combo.length - 1) return;
    setCombo((prev) => {
      const newCombo = [...prev];
      [newCombo[index], newCombo[index + 1]] = [newCombo[index + 1], newCombo[index]];
      return newCombo;
    });
  };

  const moveToTop = (index: number) => {
    if (index === 0) return;
    setCombo((prev) => {
      const newCombo = [...prev];
      const [item] = newCombo.splice(index, 1);
      newCombo.unshift(item);
      return newCombo;
    });
  };

  const moveToBottom = (index: number) => {
    if (index === combo.length - 1) return;
    setCombo((prev) => {
      const newCombo = [...prev];
      const [item] = newCombo.splice(index, 1);
      newCombo.push(item);
      return newCombo;
    });
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    dragItemRef.current = index;
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number) => {
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    const fromIndex = dragItemRef.current;
    if (fromIndex === null || fromIndex === index) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      dragItemRef.current = null;
      return;
    }
    setCombo((prev) => {
      const newCombo = [...prev];
      const [draggedItem] = newCombo.splice(fromIndex, 1);
      newCombo.splice(index, 0, draggedItem);
      return newCombo;
    });
    setDraggedIndex(null);
    setDragOverIndex(null);
    dragItemRef.current = null;
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    dragItemRef.current = null;
  };

  const clearCombo = () => {
    setCombo([]);
    setComboName('');
    localStorage.removeItem('poleDanceCurrentCombo');
  };

  const saveCombo = () => {
    if (combo.length === 0) return;
    const newCombo: SavedCombo = {
      id: `combo-${Date.now()}`,
      name: comboName || `Combo ${savedCombos.length + 1}`,
      moves: combo,
      savedAt: new Date().toLocaleString(),
    };
    const updated = [...savedCombos, newCombo];
    setSavedCombos(updated);
    localStorage.setItem('poleDanceSavedCombos', JSON.stringify(updated));
    localStorage.setItem('poleDanceCurrentCombo', JSON.stringify({ name: newCombo.name, moves: combo }));
    setToastMessage('Combo saved');
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2000);
  };

  const loadCombo = (saved: SavedCombo) => {
    setCombo(saved.moves);
    setComboName(saved.name);
  };

  const deleteCombo = (id: string) => {
    const updated = savedCombos.filter((c) => c.id !== id);
    setSavedCombos(updated);
    localStorage.setItem('poleDanceSavedCombos', JSON.stringify(updated));
  };

  // Generate formatted text export
  const generateExportText = () => {
    const name = comboName || 'Untitled Combo';
    const lines: string[] = [];
    lines.push(`🩰 ${name}`);
    if (instructorName) lines.push(`👩‍🏫 Instructor: ${instructorName}`);
    lines.push('');
    lines.push('--- Combo Sequence ---');
    combo.forEach((move, idx) => {
      lines.push(`${idx + 1}. ${move.name} [${move.level} • ${move.category}]`);
    });
    lines.push('');
    lines.push(`Total Moves: ${combo.length}`);
    const levelOrder = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    const highestLevel = combo.reduce((highest, move) => {
      return levelOrder.indexOf(move.level) > levelOrder.indexOf(highest) ? move.level : highest;
    }, 'Beginner');
    lines.push(`Highest Level: ${highestLevel}`);
    lines.push(`Categories: ${[...new Set(combo.map((m) => m.category))].join(', ')}`);
    return lines.join('\n');
  };

  // Open share modal
  const openShareModal = () => {
    setShareLink('');
    setShareCopied(false);
    setExportText(generateExportText());
    setShowShareModal(true);
  };

  // Generate shareable link
  const generateShareLink = async () => {
    if (combo.length === 0) return;
    setShareLoading(true);
    try {
      const shareId = `combo-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      if (instructorName) {
        localStorage.setItem('poleDanceInstructorName', instructorName);
      }

      await client.entities.shared_combos.create({
        data: {
          share_id: shareId,
          name: comboName || 'Untitled Combo',
          moves: JSON.stringify(combo),
          instructor_name: instructorName || undefined,
          description: shareDescription || undefined,
        },
      });

      const baseUrl = window.location.origin;
      const link = `${baseUrl}/shared/${shareId}`;
      setShareLink(link);
    } catch (err) {
      console.error('Failed to share combo:', err);
      setToastMessage('Failed to share. Please try again.');
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 3000);
    } finally {
      setShareLoading(false);
    }
  };

  const copyShareLink = () => {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const copyExportText = () => {
    navigator.clipboard.writeText(exportText);
    setToastMessage('Text copied to clipboard!');
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl text-foreground">Combo Builder</h1>
          <p className="font-body text-foreground mt-1">
            Create flowing combinations by sequencing moves together
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Moves Library - Left Side */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="font-heading text-lg">Moves Library</CardTitle>
                <p className="text-sm text-foreground font-body">
                  Click a move to add it to your combo
                </p>
                {/* Search */}
                <div className="relative mt-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search moves..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 font-body"
                  />
                </div>
                {/* Filters */}
                <div className="flex gap-2 mt-2">
                  <Select value={filterLevel} onValueChange={setFilterLevel}>
                    <SelectTrigger className="flex-1 text-sm">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="flex-1 text-sm">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto space-y-2">
                {loading && (
                  <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="p-3 rounded-lg border border-border animate-pulse">
                        <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                        <div className="flex gap-1">
                          <div className="h-5 bg-muted rounded w-16" />
                          <div className="h-5 bg-muted rounded w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {error && (
                  <div className="text-center py-8">
                    <p className="text-destructive font-body text-sm">{error}</p>
                    <p className="text-muted-foreground text-xs mt-1">Please try refreshing the page</p>
                  </div>
                )}
                {!loading && !error && filteredMoves.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground font-body text-sm">No moves found</p>
                    <p className="text-muted-foreground text-xs mt-1">Try adjusting your filters</p>
                  </div>
                )}
                {!loading &&
                  !error &&
                  filteredMoves.map((move) => (
                    <div
                      key={move.id}
                      onClick={() => addToCombo(move)}
                      className="p-3 rounded-lg border border-border hover:border-purple/40 cursor-pointer transition-all hover:shadow-sm group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-heading font-medium text-sm">{move.name}</span>
                          <div className="flex gap-1 mt-1">
                            <Badge
                              variant="outline"
                              className={`text-xs ${getLevelBadgeClasses(move.level)}`}
                            >
                              {move.level}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {move.category}
                            </Badge>
                          </div>
                        </div>
                        <Plus className="h-4 w-4 text-foreground group-hover:text-purple transition-colors" />
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>

          {/* Combo Sequence - Right Side */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-purple/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-heading text-lg">Your Combo</CardTitle>
                    <p className="text-sm text-foreground font-body">
                      {combo.length === 0
                        ? 'Add moves from the library to build your combo'
                        : `${combo.length} move${combo.length > 1 ? 's' : ''} in sequence`}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {combo.length > 0 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearCombo}
                          className="gap-1 border-red-300 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                        >
                          <Trash2 className="h-3 w-3" />
                          Clear
                        </Button>
                        <Button
                          size="sm"
                          onClick={saveCombo}
                          className="bg-purple text-white hover:bg-purple-light gap-1"
                        >
                          <Save className="h-3 w-3" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={openShareModal}
                          className="gap-1 border-purple/30 text-purple hover:bg-purple/5"
                        >
                          <Share2 className="h-3 w-3" />
                          Share
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                {/* Combo Name Input */}
                {combo.length > 0 && (
                  <Input
                    placeholder="Name your combo (e.g., Beginner Spin Flow)"
                    value={comboName}
                    onChange={(e) => setComboName(e.target.value)}
                    className="mt-3 font-body"
                  />
                )}
              </CardHeader>
              <CardContent>
                {combo.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
                    <LayersIcon className="h-12 w-12 text-foreground/40 mx-auto mb-3" />
                    <p className="font-body text-foreground">
                      Your combo sequence will appear here
                    </p>
                    <p className="font-body text-sm text-foreground/70 mt-1">
                      Click moves from the library to add them
                    </p>
                  </div>
                ) : (
                  <div className="space-y-0">
                    {combo.map((move, index) => (
                      <div key={`${move.id}-${index}`}>
                        {/* Draggable item - separate from arrow connector */}
                        <div
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragEnter={() => handleDragEnter(index)}
                          onDragLeave={handleDragLeave}
                          onDragOver={handleDragOver}
                          onDrop={() => handleDrop(index)}
                          onDragEnd={handleDragEnd}
                          className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                            draggedIndex === index
                              ? 'opacity-50 border-muted bg-muted/30'
                              : dragOverIndex === index
                                ? 'border-purple border-2 bg-purple/5 shadow-md'
                                : 'border-border bg-white hover:shadow-sm'
                          } cursor-grab active:cursor-grabbing`}
                        >
                          {/* Drag handle */}
                          <div className="text-foreground/40 hover:text-foreground/70 transition-colors">
                            <GripVertical className="h-5 w-5" />
                          </div>
                          {/* Reorder buttons */}
                          <div className="flex flex-col gap-0.5">
                            <button
                              onClick={() => moveToTop(index)}
                              className="text-foreground/50 hover:text-purple disabled:opacity-20 transition-colors"
                              disabled={index === 0}
                              title="Move to top"
                            >
                              <ChevronsUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => moveUp(index)}
                              className="text-foreground/50 hover:text-purple disabled:opacity-20 transition-colors"
                              disabled={index === 0}
                              title="Move up one"
                            >
                              <ChevronUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => moveDown(index)}
                              className="text-foreground/50 hover:text-purple disabled:opacity-20 transition-colors"
                              disabled={index === combo.length - 1}
                              title="Move down one"
                            >
                              <ChevronDown className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => moveToBottom(index)}
                              className="text-foreground/50 hover:text-purple disabled:opacity-20 transition-colors"
                              disabled={index === combo.length - 1}
                              title="Move to bottom"
                            >
                              <ChevronsDown className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          {/* Position number */}
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple/10 text-purple font-heading font-bold text-sm">
                            {index + 1}
                          </div>
                          {/* Move info */}
                          <div className="flex-1">
                            <span className="font-heading font-medium">{move.name}</span>
                            <div className="flex gap-1 mt-1">
                              <Badge
                                variant="outline"
                                className={`text-xs ${getLevelBadgeClasses(move.level)}`}
                              >
                                {move.level}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {move.category}
                              </Badge>
                            </div>
                          </div>
                          {/* Remove button */}
                          <button
                            onClick={() => removeFromCombo(index)}
                            className="text-foreground/60 hover:text-destructive transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        {/* Arrow connector - OUTSIDE the draggable div */}
                        {index < combo.length - 1 && (
                          <div className="flex justify-center py-1">
                            <ArrowRight className="h-4 w-4 text-purple/40 rotate-90" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Combo Summary */}
                {combo.length > 0 && (
                  <div className="mt-6 p-4 bg-lavender rounded-lg">
                    <h4 className="font-heading font-semibold text-sm mb-2">Combo Summary</h4>
                    <div className="flex flex-wrap gap-4 text-sm font-body">
                      <div>
                        <span className="text-foreground/70">Moves:</span>{' '}
                        <span className="font-medium">{combo.length}</span>
                      </div>
                      <div>
                        <span className="text-foreground/70">Highest Level:</span>{' '}
                        <span className="font-medium">
                          {combo.reduce((highest, move) => {
                            const lvls = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
                            return lvls.indexOf(move.level) > lvls.indexOf(highest)
                              ? move.level
                              : highest;
                          }, 'Beginner')}
                        </span>
                      </div>
                      <div>
                        <span className="text-foreground/70">Categories:</span>{' '}
                        <span className="font-medium">
                          {[...new Set(combo.map((m) => m.category))].join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Saved Combos */}
            {savedCombos.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="font-heading text-lg flex items-center gap-2">
                    <List className="h-5 w-5 text-purple" />
                    Saved Combos
                  </CardTitle>
                  <p className="text-sm text-foreground font-body">
                    Your previously saved combinations
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {savedCombos.map((saved) => (
                    <div
                      key={saved.id}
                      className="p-4 rounded-lg border border-border hover:border-purple/30 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-heading font-medium">{saved.name}</h4>
                          <p className="text-xs text-foreground/60">
                            {saved.moves.length} moves • Saved {saved.savedAt}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => loadCombo(saved)}
                            className="text-xs gap-1"
                          >
                            Load
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteCombo(saved.id)}
                            className="text-xs gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-1">
                        {saved.moves.map((move, idx) => (
                          <div key={`${move.id}-${idx}`} className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">
                              {move.name}
                            </Badge>
                            {idx < saved.moves.length - 1 && (
                              <span className="text-purple/40 text-xs">→</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-xl flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-purple" />
                  Share Combo
                </h2>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Share Link Section */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="font-body text-sm font-medium text-foreground/70 block mb-1">
                    Your Name (optional)
                  </label>
                  <Input
                    placeholder="e.g., Coach Sarah"
                    value={instructorName}
                    onChange={(e) => setInstructorName(e.target.value)}
                    className="font-body"
                  />
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-foreground/70 block mb-1">
                    Description (optional)
                  </label>
                  <Input
                    placeholder="e.g., Great warm-up combo for intermediate students"
                    value={shareDescription}
                    onChange={(e) => setShareDescription(e.target.value)}
                    className="font-body"
                  />
                </div>

                {!shareLink ? (
                  <Button
                    onClick={generateShareLink}
                    disabled={shareLoading}
                    className="w-full bg-purple text-white hover:bg-purple-light gap-2"
                  >
                    {shareLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Generating Link...
                      </>
                    ) : (
                      <>
                        <Link2 className="h-4 w-4" />
                        Generate Shareable Link
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <label className="font-body text-sm font-medium text-foreground/70 block">
                      Shareable Link
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={shareLink}
                        readOnly
                        className="font-body text-sm flex-1"
                      />
                      <Button
                        onClick={copyShareLink}
                        variant="outline"
                        className="gap-1 shrink-0"
                      >
                        {shareCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {shareCopied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                    <p className="text-xs text-foreground/50 font-body">
                      Anyone with this link can view your combo
                    </p>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-border my-6"></div>

              {/* Export as Text Section */}
              <div>
                <h3 className="font-heading font-semibold text-base mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple" />
                  Export as Text
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  <pre className="text-xs font-body text-foreground whitespace-pre-wrap">
                    {exportText}
                  </pre>
                </div>
                <Button
                  onClick={copyExportText}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy Text to Clipboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showSaveToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className="flex items-center gap-2 bg-purple text-white px-4 py-3 rounded-lg shadow-lg">
            <Check className="h-4 w-4" />
            <span className="font-heading text-sm">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function LayersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22.54 12.43-1.42-.65-8.58 3.91a2 2 0 0 1-1.66 0L2.3 11.78l-1.42.65a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22.54 16.43-1.42-.65-8.58 3.91a2 2 0 0 1-1.66 0L2.3 15.78l-1.42.65a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
    </svg>
  );
}