import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Share2, Copy, Check } from 'lucide-react';
import { createClient } from '@metagptx/web-sdk';
import { Logo } from '@/components/Logo';

const client = createClient();

interface SharedComboData {
  id: number;
  share_id: string;
  name: string;
  moves: string;
  instructor_name?: string;
  description?: string;
  created_at?: string;
}

interface MoveItem {
  id: string;
  name: string;
  category: string;
  type: string;
}

export default function SharedCombo() {
  const { shareId } = useParams<{ shareId: string }>();
  const [comboData, setComboData] = useState<SharedComboData | null>(null);
  const [moves, setMoves] = useState<MoveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (shareId) {
      fetchSharedCombo(shareId);
    }
  }, [shareId]);

  const fetchSharedCombo = async (id: string) => {
    try {
      setLoading(true);
      const response = await client.apiCall.invoke({
        url: `/api/v1/entities/shared_combos/share/${id}`,
        method: 'GET',
        data: {},
      });
      const data = response.data;
      setComboData(data);
      try {
        const parsedMoves = JSON.parse(data.moves);
        setMoves(parsedMoves);
      } catch {
        setMoves([]);
      }
    } catch {
      setError('Combo not found or link has expired.');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple mx-auto mb-4"></div>
          <p className="font-body text-foreground">Loading shared combo...</p>
        </div>
      </div>
    );
  }

  if (error || !comboData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="font-heading text-xl font-bold mb-2">Combo Not Found</h2>
            <p className="font-body text-foreground/70 mb-6">{error}</p>
            <Link to="/">
              <Button className="bg-purple text-white hover:bg-purple-light">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link to="/">
            <Logo width={200} height={50} className="text-foreground" />
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Share2 className="h-5 w-5 text-purple" />
            <span className="text-sm font-body text-foreground/60">Shared Combo</span>
          </div>
          <h1 className="font-heading font-bold text-3xl text-foreground">{comboData.name}</h1>
          {comboData.instructor_name && (
            <p className="font-body text-foreground/70 mt-2">
              Shared by <span className="font-medium">{comboData.instructor_name}</span>
            </p>
          )}
          {comboData.description && (
            <p className="font-body text-foreground/60 mt-1">{comboData.description}</p>
          )}
        </div>

        {/* Combo Moves */}
        <Card className="border-purple/20 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-lg">
              Combo Sequence ({moves.length} move{moves.length !== 1 ? 's' : ''})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {moves.map((move, index) => (
                <div key={`${move.id}-${index}`}>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-white">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple/10 text-purple font-heading font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <span className="font-heading font-medium">{move.name}</span>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {move.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {move.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {index < moves.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowRight className="h-4 w-4 text-purple/40 rotate-90" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-lavender rounded-lg">
              <h4 className="font-heading font-semibold text-sm mb-2">Combo Summary</h4>
              <div className="flex flex-wrap gap-4 text-sm font-body">
                <div>
                  <span className="text-foreground/70">Moves:</span>{' '}
                  <span className="font-medium">{moves.length}</span>
                </div>
                <div>
                  <span className="text-foreground/70">Highest Level:</span>{' '}
                  <span className="font-medium">
                    {moves.reduce((highest, move) => {
                      const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
                      return levels.indexOf(move.category) > levels.indexOf(highest)
                        ? move.category
                        : highest;
                    }, 'Beginner')}
                  </span>
                </div>
                <div>
                  <span className="text-foreground/70">Types:</span>{' '}
                  <span className="font-medium">
                    {[...new Set(moves.map((m) => m.type))].join(', ')}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            onClick={copyLink}
            variant="outline"
            className="gap-2"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          <Link to="/combo">
            <Button className="bg-purple text-white hover:bg-purple-light gap-2">
              <ArrowLeft className="h-4 w-4" />
              Open Combo Builder
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}