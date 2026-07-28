"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SocialIcon } from "@/components/public/SocialIcon";
import {
  managementNavigation,
  type ManagementNavChild,
  type ManagementNavItem,
} from "@/lib/public-navigation";

const tooltip = "سيتم إضافة الرابط من إدارة الكلية";

function DisabledItem({ item }: { item: ManagementNavChild }) {
  return (
    <span
      aria-disabled="true"
      className="legacy-dropdown-disabled"
      role="link"
      title={tooltip}
    >
      {item.icon ? (
        <span aria-hidden="true" className="legacy-platform-icon">
          <SocialIcon name={item.icon} />
        </span>
      ) : null}
      <span>
        <b>{item.label}</b>
        <small>{tooltip}</small>
      </span>
    </span>
  );
}

function NavigationChild({ item }: { item: ManagementNavChild }) {
  const [open, setOpen] = useState(false);

  if (item.disabled) return <DisabledItem item={item} />;

  if (!item.children) {
    return (
      <Link href={item.href!}>
        {item.icon ? <span aria-hidden="true" className="legacy-platform-icon"><SocialIcon name={item.icon} /></span> : null}
        <span><b>{item.label}</b></span>
      </Link>
    );
  }

  return (
    <div className={`legacy-nested-item ${open ? "is-open" : ""}`}>
      <button aria-expanded={open} className="legacy-nested-trigger" onClick={() => setOpen((value) => !value)} type="button">
        <span>{item.label}</span><span aria-hidden="true">⌄</span>
      </button>
      {open ? (
        <div className="legacy-nested-menu">
          {item.href ? <Link href={item.href}><span><b>نظرة عامة</b></span></Link> : null}
          {item.children.map((child) => <NavigationChild item={child} key={child.label} />)}
        </div>
      ) : null}
    </div>
  );
}

function NavigationItem({ item }: { item: ManagementNavItem }) {
  const [open, setOpen] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const update = () => setDesktop(window.innerWidth > 1320);
    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  if (!item.children) {
    return (
      <li>
        <Link className={item.icon ? "legacy-broadcast-link" : undefined} href={item.href!}>
          {item.icon ? <span aria-hidden="true">{item.icon}</span> : null}
          {item.label}
        </Link>
      </li>
    );
  }

  function clearScheduledClose() {
    if (!closeTimerRef.current) return;
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }

  function updatePosition() {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const width = Math.min(390, window.innerWidth - 36);
    setPosition({
      left: Math.max(18, Math.min(rect.right - width, window.innerWidth - width - 18)),
      top: rect.bottom + 10,
    });
  }

  function openDesktopMenu() {
    if (!desktop) return;
    clearScheduledClose();
    updatePosition();
    setOpen(true);
  }

  function scheduleDesktopClose() {
    if (!desktop) return;
    clearScheduledClose();
    closeTimerRef.current = setTimeout(() => setOpen(false), 180);
  }

  const menu = (
    <div
      className={`mega-menu ${desktop ? "legacy-floating-menu" : ""}`}
      onFocus={clearScheduledClose}
      onMouseEnter={clearScheduledClose}
      onMouseLeave={scheduleDesktopClose}
      role="menu"
      style={desktop ? position : undefined}
    >
      {item.href && !item.children.some((child) => child.href === item.href) ? (
        <Link href={item.href}>
          <span><b>نظرة عامة</b><small>{item.label}</small></span>
        </Link>
      ) : null}
      {item.children.map((child) => <NavigationChild item={child} key={child.label} />)}
    </div>
  );

  function toggleMenu() {
    clearScheduledClose();
    if (desktop) {
      openDesktopMenu();
      return;
    }
    setOpen((value) => !value);
  }

  return (
    <li
      className={open ? "dropdown-open" : undefined}
      onBlur={scheduleDesktopClose}
      onFocus={openDesktopMenu}
      onMouseEnter={openDesktopMenu}
      onMouseLeave={scheduleDesktopClose}
    >
      <button aria-expanded={open} aria-haspopup="true" className="nav-link-button" onClick={toggleMenu} ref={buttonRef} type="button">
        {item.label} <span aria-hidden="true">⌄</span>
      </button>
      {desktop ? (open ? createPortal(menu, document.body) : null) : menu}
    </li>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <a className="skip-link" href="#main">انتقل إلى المحتوى</a>
      <header className="site-header">
        <div className="container nav-shell">
          <div className="brand-column">
            <Link aria-label="كلية الحديث وعلومه — الصفحة الرئيسية" className="brand" href="/">
              <Image alt="شعار كلية الحديث وعلومه" className="brand-emblem" height={58} loading="eager" src="/brand/hadith-college-logo-128.png" width={58} />
              <span className="brand-copy"><b>كلية الحديث وعلومه</b><small>للرواية والدراية والتحقيق</small></span>
            </Link>
            <Link className="header-university-accreditation" href="/about/university">
              <Image alt="" aria-hidden="true" height={26} src="/brand/aboubacar-ibrahim-university-icon-64.png" width={26} />
              <span>معتمدة من جامعة أبو بكر إبراهيم</span>
            </Link>
          </div>
          <ul aria-label="التنقل الرئيسي" className={`nav-links ${mobileOpen ? "open" : ""}`}>
            <li className="mobile-university-accreditation">
              <Link href="/about/university">
                <Image alt="" aria-hidden="true" height={26} src="/brand/aboubacar-ibrahim-university-icon-64.png" width={26} />
                <span>معتمدة من جامعة أبو بكر إبراهيم</span>
              </Link>
            </li>
            <li className="mobile-student-login"><Link href="/dashboard/student">دخول الطالب</Link></li>
            {managementNavigation.map((item) => <NavigationItem item={item} key={item.label} />)}
          </ul>
          <div className="nav-actions">
            <Link className="btn gold legacy-student-login" href="/dashboard/student">دخول الطالب</Link>
            <button aria-expanded={mobileOpen} aria-label="فتح القائمة" className="menu-toggle" onClick={() => setMobileOpen((value) => !value)} type="button">☰</button>
          </div>
        </div>
      </header>
    </>
  );
}
