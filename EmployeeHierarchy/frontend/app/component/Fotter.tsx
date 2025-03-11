"use client"
import { Container, Divider, Text } from "@mantine/core";

function Footer() {
  return (
    <footer className="bg-gray-100 shadow-md w-full absolute bottom-0">
      <Divider className="border-t border-gray-600" />
      <Container className="text-center py-4">
        <Text size="sm" color="dimmed">
          © 2025 All rights reserved.
        </Text>
      </Container>
    </footer>
  );
}

export default Footer;