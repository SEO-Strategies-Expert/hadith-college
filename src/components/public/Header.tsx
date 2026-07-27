"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
          {item.icon}
        </span>
      ) : null}
      <span>
        <b>{item.label}</b>
        <small>{tooltip}</small>
      </span>
    </span>
  );
}

function NavigationItem({ item }: { item: ManagementNavItem }) {
  const [open, setOpen] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const update = () => setDesktop(window.innerWidth > 1120);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!item.children) {
    return (
      <li>
        <Link
          className={item.icon ? "legacy-broadcast-link" : undefined}
          href={item.href!}
        >
          {item.icon ? <span aria-hidden="true">{item.icon}</span> : null}
          {item.label}
        </Link>
      </li>
    );
  }

  const menu = (
    <div
      className={`mega-menu ${desktop && open ? "legacy-floating-menu" : ""}`}
      role="menu"
      style={desktop ? position : undefined}
    >
      {item.href &&
      !item.children.some((child) => child.href === item.href) ? (
        <Link href={item.href}>
          <span>
            <b>نظرة عامة</b>
            <small>{item.label}</small>
          </span>
        </Link>
      ) : null}
      {item.children.map((child) =>
        child.disabled ? (
          <DisabledItem item={child} key={child.label} />
        ) : (
          <Link href={child.href!} key={child.label}>
            {child.icon ? (
              <span aria-hidden="true" className="legacy-platform-icon">
                {child.icon}
              </span>
            ) : null}
            <span>
              <b>{child.label}</b>
            </span>
          </Link>
        ),
      )}
    </div>
  );

  function toggleMenu() {
    if (desktop && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const width = 390;
      setPosition({
        left: Math.max(18, Math.min(rect.right - width, window.innerWidth - width - 18)),
        top: rect.bottom + 10,
      });
    }
    setOpen((value) => !value);
  }

  return (
    <li className={open ? "dropdown-open" : undefined}>
      <button
        aria-expanded={open}
        aria-haspopup="true"
        className="nav-link-button"
        onClick={toggleMenu}
        ref={buttonRef}
        type="button"
      >
        {item.university ? (
          <Image
            alt=""
            aria-hidden="true"
            className="legacy-university-nav-logo"
            height={28}
            src="/brand/aboubacar-ibrahim-university-icon-64.png"
            width={28}
          />
        ) : null}
        {item.label} <span aria-hidden="true">⌄</span>
      </button>
      {open && desktop ? createPortal(menu, document.body) : menu}
    </li>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <a className="skip-link" href="#main">
        انتقل إلى المحتوى
      </a>
      <div className="topbar">
        <div className="container">
          <span>كلية متخصصة في الرواية والدراية والتحقيق</span>
          <div className="topbar-links">
            <Link href="/journal/research">مجلة الكلية</Link>
            <Link href="/dashboard/student">دخول الطالب</Link>
            <Link href="/contact">الدعم والتواصل</Link>
          </div>
        </div>
      </div>
      <header className="site-header">
        <Link
          aria-label="جامعة أبو بكر إبراهيم"
          className="header-accreditation"
          href="/about/university"
        >
          <span className="container header-accreditation-inner">
            <span className="header-accreditation-icon" aria-hidden="true">
              <Image
                alt=""
                height={34}
                src="/brand/aboubacar-ibrahim-university-icon-64.png"
                width={34}
              />
            </span>
            <span className="header-accreditation-copy">
              <small>الجهة الجامعية المعتمدة</small>
              <strong>جامعة أبو بكر إبراهيم</strong>
            </span>
            <span className="header-accreditation-label">اعتماد أكاديمي</span>
          </span>
        </Link>
        <div className="container nav-shell">
          <Link
            aria-label="كلية الحديث وعلومه — الصفحة الرئيسية"
            className="brand"
            href="/"
          >
            <Image
              alt="شعار كلية الحديث وعلومه"
              className="brand-emblem"
              height={58}
              loading="eager"
              src="/brand/hadith-college-logo-128.png"
              width={58}
            />
            <span className="brand-copy">
              <b>كلية الحديث وعلومه</b>
              <small>للرواية والدراية والتحقيق</small>
            </span>
          </Link>
          <ul
            aria-label="التنقل الرئيسي"
            className={`nav-links ${mobileOpen ? "open" : ""}`}
          >
            {managementNavigation.map((item) => (
              <NavigationItem item={item} key={item.label} />
            ))}
          </ul>
          <div className="nav-actions">
            <Link className="btn gold legacy-student-login" href="/dashboard/student">
              دخول الطالب
            </Link>
            <button
              aria-expanded={mobileOpen}
              aria-label="فتح القائمة"
              className="menu-toggle"
              onClick={() => setMobileOpen((value) => !value)}
              type="button"
            >
              ☰
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
