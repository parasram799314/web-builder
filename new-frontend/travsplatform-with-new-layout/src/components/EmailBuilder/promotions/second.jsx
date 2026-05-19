import React, { useState } from 'react';
import EditableText from '../EditableText';
import EditableButton from '../EditableButton';
import EditableImage from '../EditableImage';
import LibrarySelector from '../LibrarySelector';

const AzureTrails = (props) => {
  if (props.isAdmin) {
    return <AzureTrailsEditor {...props} />;
  }
  return <AzureTrailsStatic {...props} />;
};

const AzureTrailsEditor = (props) => {
  const [showLibrary, setShowLibrary] = useState(false);
  return <AzureTrailsStatic {...props} showLibrary={showLibrary} setShowLibrary={setShowLibrary} />;
};

const AzureTrailsStatic = ({ data, isAdmin, onUpdate, userPackages = [], showLibrary, setShowLibrary, color = "#FF6B6B" }) => {
  const defaults = {
    hero: {
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=640&q=80",
      badge: "✦ LIMITED TIME OFFER ✦",
      title: "Escape the",
      italic: "Ordinary.",
      subtitle: "Hand-picked luxury escapes with up to 45% off. Crystal waters, alpine peaks, and city lights await.",
      cta: { text: "Explore Packages →", link: "https://wanderlust.travel/packages" }
    },
    destinations: [
      {
        country: "SWITZERLAND", 
        title: "Alpine Retreat", 
        desc: "7 nights · Chalet stay · Cable car & ski pass included",
        oldPrice: "$2,890",
        newPrice: "$1,749",
        img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=640&q=80",
        cta: { text: "View Details", link: "https://wanderlust.travel/switzerland" }
      },
      {
        country: "FRANCE", 
        title: "Parisian Romance", 
        desc: "5 nights · Boutique hotel · Seine cruise tour",
        oldPrice: "$2,250",
        newPrice: "$1,399",
        img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=640&q=80",
        cta: { text: "View Details", link: "https://wanderlust.travel/france" }
      }
    ]
  };

  const hero = { ...defaults.hero, ...data?.hero };
  const destinations = data?.destinations || defaults.destinations;

  const updateDest = (index, field, value) => {
    const newDest = [...destinations];
    newDest[index] = { ...newDest[index], [field]: value };
    onUpdate("destinations", newDest);
  };

  const addPackage = (pkg) => {
    const newDest = [...destinations, {
      country: pkg.country?.toUpperCase() || "INDIA",
      title: pkg.title,
      desc: pkg.description || pkg.desc || "",
      oldPrice: pkg.originalPrice ? `₹${pkg.originalPrice}` : "",
      newPrice: pkg.price ? `₹${pkg.price}` : "$0",
      img: pkg.image || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=640&q=80",
      cta: { text: "View Details", link: pkg.detailsLink || "https://wanderlust.travel" }
    }];
    onUpdate("destinations", newDest);
  };

  const removePackage = (index) => {
    const newDest = destinations.filter((_, i) => i !== index);
    onUpdate("destinations", newDest);
  };

  return (
    <div style={{ backgroundColor: '#0f1724', padding: '20px 0', fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%" style={{ maxWidth: '640px', backgroundColor: '#ffffff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,.35)' }}>
        {/* Header */}
        <tr>
          <td style={{ padding: '25px 32px', borderBottom: '1px solid #f1f1f4' }}>
            <table width="100%" border="0" cellPadding="0" cellSpacing="0">
              <tr>
                <td style={{ fontSize: '22px', fontWeight: '800', color: '#0f1724' }}>
                  <span style={{ display: 'inline-block', width: '34px', height: '34px', backgroundColor: color, borderRadius: '10px', verticalAlign: 'middle', marginRight: '10px' }}></span>
                  AZURE<span style={{ color: color }}>TRAILS</span>
                </td>
                <td align="right" style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>SUMMER 2026</td>
              </tr>
            </table>
          </td>
        </tr>

        {/* Hero Image */}
        <tr>
          <td>
            <EditableImage 
              src={hero.image || defaults.hero.image} 
              isAdmin={isAdmin} 
              onSave={(v) => onUpdate("hero", { ...hero, image: v })}
              alt="Hero" 
              style={{ display: 'block', width: '100%', height: 'auto' }} 
            />
          </td>
        </tr>

        {/* Hero Content */}
        <tr>
          <td align="center" style={{ padding: '48px 36px', background: '#0f1724', color: '#ffffff' }}>
            <div style={{ display: 'inline-block', backgroundColor: `${color}26`, color: color, border: `1px solid ${color}66`, padding: '8px 18px', borderRadius: '999px', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', marginBottom: '20px' }}>
              <EditableText 
                value={hero.badge} 
                isAdmin={isAdmin} 
                onSave={(v) => onUpdate("hero", { ...hero, badge: v })} 
              />
            </div>
            <h1 style={{ margin: '0 0 14px 0', fontSize: '42px', lineHeight: '1.1', fontWeight: '800' }}>
              <EditableText 
                  value={hero.title} 
                  isAdmin={isAdmin} 
                  onSave={(v) => onUpdate("hero", { ...hero, title: v })} 
              />
              <br />
              <EditableText 
                  value={hero.italic} 
                  isAdmin={isAdmin} 
                  onSave={(v) => onUpdate("hero", { ...hero, italic: v })} 
                  style={{ color: color, fontStyle: 'italic' }} 
              />
            </h1>
            <div style={{ margin: '0 auto 28px', maxWidth: '440px', fontSize: '16px', lineHeight: '1.6', color: '#cbd5e1' }}>
              <EditableText 
                value={hero.subtitle} 
                isAdmin={isAdmin} 
                onSave={(v) => onUpdate("hero", { ...hero, subtitle: v })} 
                multiline
              />
            </div>
            
            <EditableButton 
              text={hero.cta?.text || defaults.hero.cta.text}
              link={hero.cta?.link || defaults.hero.cta.link}
              isAdmin={isAdmin}
              onSave={(v) => onUpdate("hero", { ...hero, cta: v })}
              style={{ display: 'inline-block', background: color, color: '#ffffff', textDecoration: 'none', fontWeight: '700', padding: '16px 38px', borderRadius: '999px', fontSize: '15px', border: 'none' }} 
            />
          </td>
        </tr>

        {/* Destination Cards */}
        <tr>
          <td style={{ padding: '40px 24px' }}>
            {destinations.map((pkg, index) => (
              <table key={index} width="100%" border="0" cellPadding="0" cellSpacing="0" style={{ marginBottom: '20px', backgroundColor: '#f8fafc', borderRadius: '18px', overflow: isAdmin ? 'visible' : 'hidden' }}>
                <tr>
                  <td width="220" style={{ verticalAlign: 'top', position: 'relative' }}>
                    <EditableImage 
                      src={pkg.img} 
                      isAdmin={isAdmin} 
                      onSave={(v) => updateDest(index, "img", v)}
                      alt={pkg.title} 
                      style={{ display: 'block', height: '200px', width: '220px', objectFit: 'cover', borderTopLeftRadius: '18px', borderBottomLeftRadius: '18px' }} 
                    />
                    {isAdmin && (
                      <div 
                        onClick={() => removePackage(index)}
                        style={{ position: 'absolute', top: '10px', left: '10px', width: '24px', height: '24px', borderRadius: '50%', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', lineHeight: '24px', zIndex: 10 }}
                      >
                        ×
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '22px 24px', verticalAlign: 'top' }}>
                    <EditableText 
                        value={pkg.country} 
                        isAdmin={isAdmin} 
                        onSave={(v) => updateDest(index, "country", v)} 
                        style={{ fontSize: '11px', color: color, fontWeight: '700', display: 'block', textTransform: 'uppercase' }} 
                    />
                    <EditableText 
                        value={pkg.title} 
                        isAdmin={isAdmin} 
                        onSave={(v) => updateDest(index, "title", v)} 
                        style={{ fontSize: '20px', fontWeight: '800', color: '#0f1724', display: 'block', margin: '5px 0' }} 
                    />
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
                      <EditableText 
                          value={pkg.desc} 
                          isAdmin={isAdmin} 
                          onSave={(v) => updateDest(index, "desc", v)} 
                          multiline
                      />
                    </div>
                    <table width="100%" border="0" cellPadding="0" cellSpacing="0" style={{ marginTop: '15px' }}>
                      <tr>
                        <td>
                          <span style={{ fontSize: '13px', color: '#ef4444', textDecoration: 'line-through' }}>
                            <EditableText value={pkg.oldPrice} isAdmin={isAdmin} onSave={(v) => updateDest(index, "oldPrice", v)} />
                          </span>
                          <span style={{ fontSize: '22px', fontWeight: '800', color: '#14B8A6', marginLeft: '6px' }}>
                            <EditableText value={pkg.newPrice} isAdmin={isAdmin} onSave={(v) => updateDest(index, "newPrice", v)} />
                          </span>
                        </td>
                        <td align="right">
                          <EditableButton 
                            text={pkg.cta?.text || "View Details"}
                            link={pkg.cta?.link || "#"}
                            isAdmin={isAdmin}
                            onSave={(v) => updateDest(index, "cta", v)}
                            style={{ display: 'inline-block', background: '#14B8A6', color: '#ffffff', textDecoration: 'none', fontWeight: '700', padding: '10px 20px', borderRadius: '12px', fontSize: '13px', border: 'none' }} 
                          />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            ))}

            {isAdmin && (
              <div 
                onClick={() => setShowLibrary(true)}
                style={{ width: '100%', padding: '16px', border: '2px dashed #cbd5e1', borderRadius: '18px', background: '#f8fafc', color: '#64748b', fontWeight: '700', fontSize: '13px', textAlign: 'center', cursor: 'pointer', marginBottom: '20px' }}
              >
                + Add Package from Library
              </div>
            )}

            {isAdmin && showLibrary && (
              <LibrarySelector 
                packages={userPackages} 
                onSelect={addPackage} 
                onClose={() => setShowLibrary(false)} 
              />
            )}
          </td>
        </tr>

        {/* Footer */}
        <tr>
          <td align="center" style={{ background: '#0f1724', padding: '40px 30px', color: '#94a3b8' }}>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', marginBottom: '10px' }}>AZURE<span style={{ color: color }}>TRAILS</span></div>
            <p style={{ fontSize: '11px', margin: '0' }}>© 2026 Azure Trails · Unsubscribe</p>
          </td>
        </tr>
      </table>
    </div>
  );
};

export default AzureTrails;
