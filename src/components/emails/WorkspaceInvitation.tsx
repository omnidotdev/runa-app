import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Markdown,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import app from "@/lib/config/app.config";

const inviteMemberDetails = {
  from: {
    value1: `${app.name} Support`,
  },
  subject: {
    value1: "You have been invited to join the",
    value2: "workspace on",
  },
  heading: `Join **{workspaceName}** on **${app.name}**`,
  greeting: "Hello",
  statement: `**{inviterUsername}** ([{inviterEmail}](mailto:{inviterEmail})) invited you to join **{workspaceName}** on **${app.name}**.`,
  cta: "Join the workspace",
  supportMessagePrefix:
    "If you were not expecting this invitation, you can ignore this email. If you are concerned about your account's safety, please email us at ",
  supportEmail: "support@omni.dev",
};

interface WorkspaceInvitation {
  /** Username of the person sending the invite. */
  inviterUsername: string;
  /** Email of the person sending the invite. */
  inviterEmail: string;
  /** Name of the workspace the invite is for. */
  workspaceName: string;
  /** Email of the person receiving the invite. */
  recipientEmail: string;
  /** URL for the invitee to accept the invitation. */
  inviteUrl?: string;
}

/**
 * Workspace invitation email template.
 */
const WorkspaceInvitation = ({
  inviterUsername,
  inviterEmail,
  workspaceName,
  recipientEmail,
  inviteUrl,
}: WorkspaceInvitation) => (
  <Html>
    <Head />
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              // TODO tokens
              brand: "#d4a72c",
              muted: "#666666",
            },
            borderColor: {
              subtle: "#eaeaea",
            },
          },
        },
      }}
    >
      <Body className="mx-auto my-auto px-2 font-sans">
        <Container className="mx-auto my-10 max-w-md rounded border border-subtle border-solid p-5">
          <Section className="mt-8">
            <Img
              // TODO CDN
              src="https://runa.omni.dev/logo.png"
              alt={`${app.name} logo`}
              width={80}
              height={40}
              className="mx-auto my-0"
            />
          </Section>

          <Heading
            as="h1"
            className="mx-0 my-8 p-0 text-center font-normal text-2xl"
          >
            <Markdown>
              {inviteMemberDetails.heading.replace(
                "{workspaceName}",
                workspaceName,
              )}
            </Markdown>
          </Heading>

          <Text className="text-sm leading-6">
            {inviteMemberDetails.greeting} {recipientEmail},
          </Text>

          <Markdown
            markdownCustomStyles={{
              link: { textDecoration: "underline" },
              p: { fontSize: 14, lineHeight: 24 },
            }}
          >
            {inviteMemberDetails.statement
              .replace("{inviterUsername}", inviterUsername)
              .replace("{inviterEmail}", inviterEmail)
              .replace("{workspaceName}", workspaceName)}
          </Markdown>

          <Section className="my-8 text-center">
            <Link
              className="rounded bg-brand px-5 py-3 text-center font-semibold text-white text-xs no-underline"
              href={inviteUrl}
            >
              {inviteMemberDetails.cta}
            </Link>
          </Section>

          <Hr className="mx-0 my-6 w-full border border-subtle border-solid" />

          <Text className="text-muted text-xs leading-6">
            {inviteMemberDetails.supportMessagePrefix}{" "}
            <a href={`mailto:${inviteMemberDetails.supportEmail}`}>
              {inviteMemberDetails.supportEmail}
            </a>
            {"."}
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default WorkspaceInvitation;
