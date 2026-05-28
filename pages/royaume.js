import { useState, useEffect } from 'react';

const S = {
  container: {
    background: 'linear-gradient(135deg, #070d1a 0%, #0a1425 50%, #050810 100%)',
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    color: '#81d4fa',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
    animation: 'glow 2s ease-in-out infinite',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#81d4fa',
    textShadow: '0 0 20px rgba(79, 195, 247, 0.4), 0 0 40px rgba(79, 195, 247, 0.2)',
    letterSpacing: '0.1em',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#4fc3f7',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  card: {
    background: 'rgba(10, 18, 32, 0.4)',
    border: '1px solid rgba(26, 48, 80, 0.6)',
    borderRadius: '12px',
    padding: '2rem',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 48px rgba(79, 195, 247, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(79, 195, 247, 0.8)',
    },
  },
  cardTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#4fc3f7',
    marginBottom: '1rem',
    textShadow: '0 0 10px rgba(79, 195, 247, 0.2)',
  },
  cardContent: {
    fontSize: '0.95rem',
    color: '#a0d8f7',
    lineHeight: '1.6',
    minHeight: '200px',
    overflowY: 'auto',
    maxHeight: '400px',
  },
  cardMeta: {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(79, 195, 247, 0.2)',
    fontSize: '0.8rem',
    color: '#2a6a9a',
    display: 'flex',
    justifyContent: 'space-between',
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: '#2a6a9a',
    fontSize: '1.2rem',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: '#4fc3f7',
    fontSize: '1.2rem',
  },
};

export default function RoyaumeWidgets() {
  const [widgets, setWidgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWidgets();
  }, []);

  async function fetchWidgets() {
    try {
      setLoading(true);
      const res = await fetch('/api/list-pages?subdomain=royaume.milele4ever.com');
      const data = await res.json();
      setWidgets(data.pages || []);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des widgets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 20px rgba(79, 195, 247, 0.4), 0 0 40px rgba(79, 195, 247, 0.2); }
          50% { text-shadow: 0 0 30px rgba(79, 195, 247, 0.6), 0 0 60px rgba(79, 195, 247, 0.3); }
        }
        * {
          box-sizing: border-box;
        }
      `}</style>

      <div style={S.container}>
        <div style={S.header}>
          <h1 style={S.title}>🏰 ROYAUME</h1>
          <p style={S.subtitle}>Widgets — Affichage indépendant</p>
        </div>

        {loading && <p style={S.loading}>Chargement des widgets…</p>}
        {error && <p style={{ ...S.empty, color: '#ef5350' }}>{error}</p>}
        {!loading && widgets.length === 0 && (
          <p style={S.empty}>Aucun widget disponible pour le moment.</p>
        )}

        {!loading && widgets.length > 0 && (
          <div style={S.grid}>
            {widgets.map((widget, idx) => (
              <div
                key={idx}
                style={{
                  ...S.card,
                  transform: 'translateY(0)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow =
                    '0 12px 48px rgba(79, 195, 247, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(79, 195, 247, 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(26, 48, 80, 0.6)';
                }}
              >
                <div style={S.cardTitle}>{widget.title || `Widget ${idx + 1}`}</div>
                <div
                  style={S.cardContent}
                  dangerouslySetInnerHTML={{ __html: widget.content || '' }}
                />
                <div style={S.cardMeta}>
                  <span>📅 {new Date(widget.created || Date.now()).toLocaleDateString('fr-FR')}</span>
                  <span>✏️ v{widget.version || 1}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
