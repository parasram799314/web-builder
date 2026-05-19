import React, { useState } from 'react';
import EditableText from '../EditableText';
import EditableButton from '../EditableButton';
import EditableImage from '../EditableImage';
import LibrarySelector from '../LibrarySelector';

const WanderlustTravels = (props) => {
  if (props.isAdmin) {
    return <WanderlustTravelsEditor {...props} />;
  }
  return <WanderlustTravelsStatic {...props} />;
};

const WanderlustTravelsEditor = (props) => {
  const [showLibrary, setShowLibrary] = useState(false);
  return <WanderlustTravelsStatic {...props} showLibrary={showLibrary} setShowLibrary={setShowLibrary} />;
};

const WanderlustTravelsStatic = ({ data, isAdmin, onUpdate, userPackages = [], showLibrary, setShowLibrary, color = "#0f2a3d" }) => {
  const defaults = {
    destinations: [
      {
        country: "Greece",
        title: "Santorini Sunsets",
        desc: "5 nights · Cliffside suite · Caldera cruise included",
        price: "$1,890",
        oldPrice: "$2,750",
        image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
        cta: { text: "View Details →", link: "https://wanderlust.travel/santorini" }
      },
      {
        country: "UAE",
        title: "Dubai Luxury Escape",
        desc: "4 nights · 5★ Burj view · Desert safari",
        price: "$1,450",
        oldPrice: "$2,100",
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80",
        cta: { text: "View Details →", link: "https://wanderlust.travel/dubai" }
      }
    ],
    header: { logo: "✈ WANDERLUST", tagline: "Since 2010" },
    hero: { 
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      title: "Escape ordinary.", 
      italic: "Discover extraordinary.", 
      subtitle: "Summer Collection 2025",
      description: "Hand-picked journeys to the world's most breathtaking destinations — with exclusive savings up to 35% off.",
      cta: { text: "Explore Collection →", link: "https://wanderlust.travel/collection" }
    },
    footer: { 
      company: "WANDERLUST TRAVELS", 
      address: "123 Marine Drive · Mumbai 400001 · India", 
      email: "hello@wanderlust.travel" 
    }
  };

  const destinations = data?.destinations || defaults.destinations;
  const header = { ...defaults.header, ...data?.header };
  const hero = { ...defaults.hero, ...data?.hero };
  const footer = { ...defaults.footer, ...data?.footer };

  const updateDest = (index, field, value) => {
    const newDest = [...destinations];
    newDest[index] = { ...newDest[index], [field]: value };
    onUpdate("destinations", newDest);
  };

  const addPackage = (pkg) => {
    const newDest = [...destinations, {
      country: pkg.country || "India",
      title: pkg.title,
      desc: pkg.description || pkg.desc || "",
      price: pkg.price ? `₹${pkg.price}` : "$0",
      oldPrice: pkg.originalPrice ? `₹${pkg.originalPrice}` : "",
      image: pkg.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
      cta: { text: "View Details →", link: pkg.detailsLink || "https://wanderlust.travel" }
    }];
    onUpdate("destinations", newDest);
  };

  const removePackage = (index) => {
    const newDest = destinations.filter((_, i) => i !== index);
    onUpdate("destinations", newDest);
  };

  return (
    <div style={{ backgroundColor: '#fdfbf7', padding: '40px 0', fontFamily: 'serif' }}>
      <table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%" style={{ maxWidth: '600px', backgroundColor: '#ffffff', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}>
        {/* Header */}
        <tr>
          <td style={{ backgroundColor: color, padding: '30px 40px' }}>
             <table width="100%" border="0" cellPadding="0" cellSpacing="0">
                <tr>
                  <td>
                    <EditableText 
                      tag="div" 
                      value={header.logo} 
                      isAdmin={isAdmin} 
                      onSave={(v) => onUpdate("header", { ...header, logo: v })} 
                      style={{ color: '#f4c97a', fontSize: '22px', fontWeight: '900', letterSpacing: '3px' }} 
                    />
                  </td>
                  <td align="right">
                    <EditableText 
                      tag="div" 
                      value={header.tagline} 
                      isAdmin={isAdmin} 
                      onSave={(v) => onUpdate("header", { ...header, tagline: v })} 
                      style={{ color: '#cfd8df', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px' }} 
                    />
                  </td>
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
          <td align="center" style={{ padding: '50px 40px' }}>
            <EditableText 
              tag="div" 
              value={hero.subtitle} 
              isAdmin={isAdmin} 
              onSave={(v) => onUpdate("hero", { ...hero, subtitle: v })} 
              style={{ color: color, fontSize: '13px', letterSpacing: '5px', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '20px' }} 
            />
            <h1 style={{ color: color, fontSize: '42px', fontWeight: 'bold', lineHeight: '1.1', marginBottom: '25px', margin: '0' }}>
              <EditableText value={hero.title} isAdmin={isAdmin} onSave={(v) => onUpdate("hero", { ...hero, title: v })} />
              <br />
              <EditableText value={hero.italic} isAdmin={isAdmin} onSave={(v) => onUpdate("hero", { ...hero, italic: v })} style={{ color: '#c69749', fontStyle: 'italic', fontWeight: '400' }} />
            </h1>
            <div style={{ maxWidth: '480px', margin: '0 auto 40px', fontSize: '16px', lineHeight: '1.8', color: '#5a6772' }}>
              <EditableText tag="div" value={hero.description} isAdmin={isAdmin} onSave={(v) => onUpdate("hero", { ...hero, description: v })} multiline />
            </div>
            
            <EditableButton 
              text={hero.cta?.text || defaults.hero.cta.text}
              link={hero.cta?.link || defaults.hero.cta.link}
              isAdmin={isAdmin}
              onSave={(v) => onUpdate("hero", { ...hero, cta: v })}
              style={{ display: 'inline-block', backgroundColor: color, color: '#f4c97a', padding: '18px 45px', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none', letterSpacing: '3px', textTransform: 'uppercase', borderRadius: '12px', border: 'none' }} 
            />
          </td>
        </tr>

        {/* Destinations */}
        <tr>
          <td style={{ padding: '0 40px' }}>
             <div style={{ height: '1px', backgroundColor: '#eeeeee', margin: '10px 0 40px' }}></div>
             <h2 style={{ color: color, fontSize: '28px', fontWeight: 'bold', textAlign: 'center', marginBottom: '35px' }}>Exclusive Destinations</h2>

             {destinations.map((item, index) => (
                <table key={index} width="100%" border="0" cellPadding="0" cellSpacing="0" style={{ marginBottom: '30px', border: '1px solid #f0f0f0', borderRadius: '24px', overflow: isAdmin ? 'visible' : 'hidden' }}>
                  <tr>
                    <td width="200" style={{ verticalAlign: 'top', position: 'relative' }}>
                       {isAdmin && (
                        <div 
                          onClick={() => removePackage(index)}
                          style={{ position: 'absolute', top: '10px', left: '10px', width: '26px', height: '26px', borderRadius: '50%', background: '#ef4444', color: 'white', border: '2px solid white', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', textAlign: 'center', lineHeight: '22px', zIndex: 10 }}
                        >
                          ×
                        </div>
                      )}
                      <EditableImage 
                        src={item.image} 
                        isAdmin={isAdmin} 
                        onSave={(v) => updateDest(index, "image", v)}
                        alt={item.title} 
                        style={{ display: 'block', height: '180px', width: '200px', objectFit: 'cover', borderTopLeftRadius: '24px', borderBottomLeftRadius: '24px' }} 
                      />
                    </td>
                    <td style={{ padding: '25px', verticalAlign: 'top' }}>
                      <EditableText tag="div" value={item.country} isAdmin={isAdmin} onSave={(v) => updateDest(index, "country", v)} style={{ color: '#c69749', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 'bold', marginBottom: '5px' }} />
                      <EditableText tag="div" value={item.title} isAdmin={isAdmin} onSave={(v) => updateDest(index, "title", v)} style={{ color: color, fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px 0', display: 'block' }} />
                      <div style={{ fontSize: '13px', color: '#777', lineHeight: '1.5', marginBottom: '15px' }}>
                        <EditableText tag="div" value={item.desc} isAdmin={isAdmin} onSave={(v) => updateDest(index, "desc", v)} multiline />
                      </div>
                      
                      <table width="100%" border="0" cellPadding="0" cellSpacing="0">
                        <tr>
                          <td>
                            <span style={{ color: color, fontSize: '18px', fontWeight: 'bold' }}>
                              <EditableText value={item.price} isAdmin={isAdmin} onSave={(v) => updateDest(index, "price", v)} />
                            </span>
                            <span style={{ color: '#ef4444', fontSize: '13px', textDecoration: 'line-through', marginLeft: '10px' }}>
                              <EditableText value={item.oldPrice} isAdmin={isAdmin} onSave={(v) => updateDest(index, "oldPrice", v)} />
                            </span>
                          </td>
                          <td align="right">
                            <EditableButton 
                              text={item.cta?.text || "View Details →"}
                              link={item.cta?.link || "#"}
                              isAdmin={isAdmin}
                              onSave={(v) => updateDest(index, "cta", v)}
                              style={{ fontSize: '12px', fontWeight: 'bold', color: '#c69749', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid #c69749', paddingBottom: '2px', background: 'transparent', border: 'none' }} 
                            />
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
             ))}

            {isAdmin && (
              <div style={{ padding: '20px', border: '1px dashed #c69749', background: '#fdfbf7', color: '#c69749', fontWeight: 'bold', fontSize: '12px', textAlign: 'center', cursor: 'pointer', marginBottom: '30px', letterSpacing: '2px', textTransform: 'uppercase' }} onClick={() => setShowLibrary(true)}>
                + Add Luxury Package from Library
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
          <td align="center" style={{ backgroundColor: color, padding: '50px 40px', color: '#cfd8df' }}>
            <EditableText tag="div" value={footer.company} isAdmin={isAdmin} onSave={(v) => onUpdate("footer", { ...footer, company: v })} style={{ color: '#f4c97a', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '15px', fontSize: '16px' }} />
            <div style={{ fontSize: '12px', lineHeight: '1.8', marginBottom: '25px', opacity: 0.8 }}>
              <EditableText tag="div" value={footer.address} isAdmin={isAdmin} onSave={(v) => onUpdate("footer", { ...footer, address: v })} multiline />
              <EditableText tag="div" value={footer.email} isAdmin={isAdmin} onSave={(v) => onUpdate("footer", { ...footer, email: v })} />
            </div>
            <p style={{ fontSize: '10px', color: '#5a6772', letterSpacing: '1px', margin: '0' }}>© 2025 Wanderlust Travels · Handcrafted Luxury</p>
          </td>
        </tr>
      </table>
    </div>
  );
};

export default WanderlustTravels;
