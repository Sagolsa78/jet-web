import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'Handcrafted Luxury Holidays for Indian Travellers';
    const subtitle = searchParams.get('subtitle') || 'Bespoke Private Itineraries · Pacing, Pure-Veg Dining & 24/7 Concierge';
    const tag = searchParams.get('tag') || 'JETO VACATIONS EDITORIAL';
    const badge = searchParams.get('badge') || 'Sample Indicative Benchmark';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#0B233F',
            backgroundImage: 'radial-gradient(circle at 15% 15%, rgba(0, 105, 115, 0.35) 0%, transparent 60%), radial-gradient(circle at 85% 85%, rgba(218, 104, 74, 0.25) 0%, transparent 60%)',
            padding: '60px 70px',
            fontFamily: 'sans-serif',
            color: '#F7F2E8',
          }}
        >
          {/* Top Bar: Brand & Tag */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: '#006973',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '26px',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                }}
              >
                J
              </div>
              <span
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  letterSpacing: '-0.5px',
                  color: '#F7F2E8',
                }}
              >
                Jeto Vacations
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px',
                borderRadius: '999px',
                backgroundColor: 'rgba(247, 242, 232, 0.1)',
                border: '1px solid rgba(247, 242, 232, 0.2)',
                fontSize: '13px',
                fontWeight: 'bold',
                letterSpacing: '1.5px',
                color: '#DA684A',
                textTransform: 'uppercase',
              }}
            >
              ✦ {tag}
            </div>
          </div>

          {/* Middle Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              maxWidth: '980px',
            }}
          >
            <h1
              style={{
                fontSize: title.length > 50 ? '48px' : '56px',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#FFFFFF',
                margin: 0,
                letterSpacing: '-1px',
              }}
            >
              {title}
            </h1>

            <p
              style={{
                fontSize: '22px',
                color: 'rgba(247, 242, 232, 0.85)',
                lineHeight: 1.45,
                margin: 0,
                maxWidth: '850px',
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Bottom Bar: Disclosures & Benchmark Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(247, 242, 232, 0.15)',
              paddingTop: '28px',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                fontSize: '14px',
                color: 'rgba(247, 242, 232, 0.7)',
              }}
            >
              <span>100% Human-Designed Travel</span>
              <span>•</span>
              <span>Verified GSTIN 07AAECJ6467D1ZI</span>
              <span>•</span>
              <span>24/7 Dedicated Concierge</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 24px',
                borderRadius: '999px',
                backgroundColor: '#DA684A',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              {badge}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (err) {
    return new Response(`Failed to generate OpenGraph image: ${err}`, { status: 500 });
  }
}
