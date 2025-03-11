"use client";
import { useState } from "react";
import {
  Burger,
  Drawer,
  Divider,
  ScrollArea,
  Anchor,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import Image from "next/image";

const Navbar: React.FC = () => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 768px)") ?? false;
  const [active, setActive] = useState("/");

  // Define links correctly
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Add", path: "/pages/create" },
    { name: "View", path: "/pages/view" }, // ✅ Corrected path
  ];

  return (
    <nav className="bg-gray-100 shadow-md py-4 px-6 md:px-10">
      {/* Nav Container */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/per.webp"
            alt="Perago Logo"
            width={150}
            height={150}
            priority
          />
        </Link>

        {/* Desktop Links */}
        {!isMobile && (
          <div className="flex gap-6">
            {navLinks.map(({ name, path }) => (
              <Anchor
                key={path}
                component={Link}
                href={path}
                onClick={() => setActive(path)}
                className={`px-4 py-2 rounded-lg transition ease-in ${
                  active === path
                    ? "bg-[#2f9e44] text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {name}
              </Anchor>
            ))}
          </div>
        )}

        {/* Mobile Burger Menu */}
        {isMobile && <Burger opened={opened} onClick={toggle} />}
      </div>

      {/* Mobile Drawer */}
      <Drawer opened={opened} onClose={close} size="75%" padding="md" title="Menu">
        <ScrollArea>
          <Divider my="sm" />
          {navLinks.map(({ name, path }) => (
            <Anchor
              key={path}
              component={Link}
              href={path}
              onClick={() => {
                setActive(path);
                close();
              }}
              className={`block py-2 px-4 rounded-lg transition ease-in ${
                active === path
                  ? "bg-[#2f9e44] text-white"
                  : "text-[#2f9e44] hover:bg-gray-200"
              }`}
            >
              {name}
            </Anchor>
          ))}
          <Divider my="sm" />
        </ScrollArea>
      </Drawer>
    </nav>
  );
};

export default Navbar;
