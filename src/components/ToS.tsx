import { List, ThemeIcon, createStyles } from "@mantine/core";

export const MOCKDATA = [
  {
    title: "Terms of Service",
    description:
      "Welcome to our gamification app platform ('Pritel'). By using our Platform, you agree to these Terms of Service ('ToS'). If you do not agree to these ToS, you may not use our Platform.",
  },
  {
    title: "Description of Service",
    description: "Once a task is complete, users receive points that can be redeemed for rewards.",
  },
  {
    title: "Account Registration",
    description:
      "In order to use our Platform, you must register for an account. You agree to provide accurate and complete information when registering for an account. You are responsible for maintaining the confidentiality of your account information, including your username and password. You agree to notify us immediately if you suspect any unauthorized use of your account.",
  },
  {
    title: "Points and Rewards",
    description:
      "The points earned by employees are virtual and have no cash value. The rewards offered by companies are at their discretion and may vary. We are not responsible for the rewards offered by companies.",
  },
  {
    title: "User Content",
    description:
      "You are solely responsible for any content you create on our Platform, including tasks and badges. You agree not to post or upload any content that is illegal, offensive, or violates any third-party rights. We reserve the right to remove any content that violates these ToS.",
  },
  {
    title: "Intellectual Property",
    description:
      "Our Platform and its contents are owned by us and our licensors and are protected by intellectual property laws. You agree not to copy, modify, distribute, or create derivative works based on our Platform or its contents without our prior written consent.",
  },
  {
    title: "Termination",
    description:
      "We reserve the right to terminate your access to our Platform at any time without notice if you violate these ToS.",
  },
  {
    title: "Disclaimer of Warranties",
    description:
      "Our Platform is provided 'as is' without warranties of any kind, either express or implied. We do not warrant that our Platform will meet your requirements or be uninterrupted, timely, secure, or error-free. We are not responsible for any damages resulting from the use of our Platform.",
  },
  {
    title: "Limitation of Liability",
    description:
      "In no event shall we be liable for any damages, including but not limited to direct, indirect, special, incidental, or consequential damages arising out of or in connection with the use of our Platform.",
  },
  {
    title: "Governing Law",
    description: "These ToS shall be governed by and construed in accordance with the laws of Republic of Uganda 😳.",
  },
  {
    title: "Changes to ToS",
    description:
      "We reserve the right to modify these ToS at any time. Your continued use of our Platform after any modifications indicates your acceptance of the modified ToS.",
  },
  {
    title: "Contact Us",
    description:
      "If you have any questions about these ToS or our Platform, please contact us at nunarazvan9898@gmail.com.",
  },
];

interface ListItemProps {
  index: number;
  title: string;
  description: string;
}

const useStyles = createStyles(theme => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
}));

export function ListItem({ index, title, description }: ListItemProps) {
  return (
    <div>
      <List.Item
        icon={
          <ThemeIcon color="blue" size={24} radius="xl">
            {index + 1}
          </ThemeIcon>
        }
      >
        <b>{title}</b> - {description}
      </List.Item>
    </div>
  );
}

export default function ToS() {
  const { classes } = useStyles();

  const listItems = MOCKDATA.map((item, index) => <ListItem {...item} key={index} index={index} />);

  return (
    <List mt={30} spacing="md" size="sm" className={classes.wrapper}>
      {listItems}
    </List>
  );
}
