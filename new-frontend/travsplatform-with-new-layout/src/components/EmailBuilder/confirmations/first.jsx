import React from 'react';
import EditableText from '../EditableText';
import EditableButton from '../EditableButton';

const BookingConfirmation = ({ data, isAdmin, onUpdate, color = "#fb7185" }) => {
  const defaults = {
    header: { 
      logo: "✈ WANDERLUST", 
      tagline: "EXPLORE THE EXTRAORDINARY" 
    },
    hero: { 
      status: "BOOKING CONFIRMED", 
      title: "Your adventure starts here!", 
      id: "TRP-882910" 
    },
    details: [
      { label: "Destination", value: "Amalfi Coast, Italy" },
      { label: "Dates", value: "14 Oct - 21 Oct, 2026" },
      { label: "Guest", value: "Mr. Arjun Sharma" },
      { label: "Package", value: "Premium Coastal Luxury" }
    ],
    summary: {
      total: "$2,450.00",
      paid: "$2,450.00",
      method: "Visa •••• 4242"
    },
    cta: {
      text: "Manage My Booking",
      link: "https://wanderlust.travel/my-booking"
    }
  };

  const header = { ...defaults.header, ...data?.header };
  const hero = { ...defaults.hero, ...data?.hero };
  const details = data?.details || defaults.details;
  const summary = { ...defaults.summary, ...data?.summary };
  const cta = { ...defaults.cta, ...data?.cta };

  const updateDetail = (index, value) => {
    const newDetails = [...details];
    newDetails[index] = { ...newDetails[index], value };
    onUpdate("details", newDetails);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '20px 0', fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%" style={{ maxWidth: '600px', backgroundColor: '#ffffff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        {/* Header */}
        <tr>
          <td align="center" style={{ padding: '30px', borderBottom: '1px solid #f1f5f9' }}>
            <EditableText 
              value={header.logo} 
              isAdmin={isAdmin} 
              onSave={(v) => onUpdate("header", { ...header, logo: v })} 
              style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', letterSpacing: '2px', display: 'block', margin: '0' }} 
            />
            <EditableText 
              value={header.tagline} 
              isAdmin={isAdmin} 
              onSave={(v) => onUpdate("header", { ...header, tagline: v })} 
              style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', letterSpacing: '2px', marginTop: '4px', display: 'block' }} 
            />
          </td>
        </tr>

        {/* Hero */}
        <tr>
          <td align="center" style={{ padding: '50px 40px', background: `linear-gradient(135deg, ${color} 0%, #000000 150%)`, color: '#ffffff' }}>
            <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff', fontSize: '10px', fontWeight: '800', letterSpacing: '1px', marginBottom: '16px' }}>
              <EditableText 
                value={hero.status} 
                isAdmin={isAdmin} 
                onSave={(v) => onUpdate("hero", { ...hero, status: v })} 
              />
            </div>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', fontWeight: '800', lineHeight: '1.2' }}>
              <EditableText 
                value={hero.title} 
                isAdmin={isAdmin} 
                onSave={(v) => onUpdate("hero", { ...hero, title: v })} 
              />
            </h1>
            <p style={{ margin: '0', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
              Booking ID: <EditableText 
                value={hero.id} 
                isAdmin={isAdmin} 
                onSave={(v) => onUpdate("hero", { ...hero, id: v })} 
                style={{ color: '#ffffff', fontWeight: '600' }} 
              />
            </p>
          </td>
        </tr>

        {/* Content */}
        <tr>
          <td style={{ padding: '40px 30px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '25px', margin: '0 0 20px 0' }}>Itinerary Details</h3>

            <table width="100%" cellPadding="0" cellSpacing="0">
              {details.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '15px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
                    {item.label}
                  </td>
                  <td align="right" style={{ padding: '15px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13px', color: '#0f172a', fontWeight: '600' }}>
                    <EditableText 
                      value={item.value} 
                      isAdmin={isAdmin} 
                      onSave={(v) => updateDetail(idx, v)} 
                    />
                  </td>
                </tr>
              ))}
            </table>

            {/* Total */}
            <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginTop: '30px', backgroundColor: '#f8fafc', borderRadius: '16px' }}>
              <tr>
                <td style={{ padding: '20px' }}>
                  <table width="100%" cellPadding="0" cellSpacing="0">
                    <tr>
                      <td style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Total Amount Paid</td>
                      <td align="right" style={{ fontSize: '20px', color: '#0f172a', fontWeight: '800' }}>
                        <EditableText 
                          value={summary.total} 
                          isAdmin={isAdmin} 
                          onSave={(v) => onUpdate("summary", { ...summary, total: v })} 
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2" style={{ fontSize: '11px', color: '#94a3b8', paddingTop: '5px' }}>
                        Paid via <EditableText 
                          value={summary.method} 
                          isAdmin={isAdmin} 
                          onSave={(v) => onUpdate("summary", { ...summary, method: v })} 
                        />
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            {/* CTA Link */}
            <div style={{ marginTop: '40px', textAlign: 'center' }}>
              <EditableButton 
                text={cta.text}
                link={cta.link}
                isAdmin={isAdmin}
                onSave={(v) => onUpdate("cta", v)}
                style={{ 
                  display: 'inline-block',
                  backgroundColor: color, 
                  color: '#ffffff', 
                  padding: '16px 40px', 
                  borderRadius: '12px', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  textDecoration: 'none',
                  boxShadow: `0 4px 12px ${color}40`
                }}
              />
            </div>
          </td>
        </tr>

        {/* Footer */}
        <tr>
          <td align="center" style={{ padding: '30px', backgroundColor: '#fcfcfc', color: '#94a3b8', fontSize: '12px', borderTop: '1px solid #f1f5f9' }}>
            Questions? Contact us at <a href="mailto:support@wanderlust.travel" style={{ color: color, textDecoration: 'none' }}>support@wanderlust.travel</a>
            <p style={{ marginTop: '10px' }}>© 2026 Wanderlust Travels. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </div>
  );
};
export default BookingConfirmation;
