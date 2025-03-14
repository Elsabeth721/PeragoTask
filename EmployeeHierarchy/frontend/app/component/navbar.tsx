"use client";

import { useState } from "react";
import { Burger, Container, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import Image from "next/image";

const Navbar: React.FC = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState("/");

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Add", path: "/pages/create" },
    { name: "View", path: "/pages/view" },
    { name: "Edit", path: "/pages/edit" },
  ];

  return (
    <header className="bg-gray-100 shadow-md py-4 px-6 md:px-10">
      <Container size="md" className="flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/per.webp"
            alt="Perago Logo"
            width={150}
            height={150}
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <Group gap={10} className="hidden md:flex">
          {navLinks.map(({ name, path }) => (
            <Link
              key={path}
              href={path}
              onClick={() => setActive(path)}
              className={`px-4 py-2 rounded-lg transition ease-in ${
                active === path
                  ? "bg-[#2f9e44] text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {name}
            </Link>
          ))}
        </Group>

        {/* Mobile Burger Icon */}
        <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
      </Container>

      {/* Drawer for Mobile Navigation */}
      {opened && (
        <div className="md:hidden absolute top-0 left-0 w-full h-full bg-white shadow-lg z-10 p-6">
          <div className="flex justify-between items-center mb-4">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/per.webp"
                alt="Perago Logo"
                width={150}
                height={150}
                priority
              />
            </Link>
            <Burger opened={opened} onClick={toggle} size="sm" />
          </div>
          <div className="flex flex-col gap-4">
            {navLinks.map(({ name, path }) => (
              <Link
                key={path}
                href={path}
                onClick={() => setActive(path)}
                className={`block py-2 px-4 rounded-lg transition ease-in ${
                  active === path
                    ? "bg-[#2f9e44] text-white"
                    : "text-[#2f9e44] hover:bg-gray-200"
                }`}
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
