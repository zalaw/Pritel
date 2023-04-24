import { useRef, useState } from "react";
import { Text, Group, Button, createStyles, rem, Box } from "@mantine/core";
import { Dropzone, FileWithPath, MIME_TYPES } from "@mantine/dropzone";
import { MdOutlineUploadFile, MdFileUpload, MdClose } from "react-icons/md";
import { useAuth, CurrentUser } from "../contexts/AuthContext";
import { generatePassword } from "../utils";
import { db, secondaryAuth, secondaryDB } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const useStyles = createStyles(theme => ({
  wrapper: {
    position: "relative",
    marginBottom: rem(30),
  },

  dropzone: {
    borderWidth: rem(1),
    paddingBottom: rem(30),
  },

  icon: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[4],
  },

  control: {
    position: "absolute",
    width: rem(200),
    left: `calc(50% - ${rem(100)})`,
    bottom: rem(-20),
  },

  box: {
    display: "flex",
    justifyContent: "space-between",
  },

  boxItemsCenter: {
    display: "flex",
    gap: ".5rem",
    alignItems: "center",
  },
}));

interface EmployeeAccount {
  email: string;
  password: string;
}

export function UploadEmailsDropZone() {
  const [loading, setLoading] = useState(false);
  const { classes, theme } = useStyles();
  const openRef = useRef<() => void>(null);
  const { currentUser, setCurrentUser, enroll, updateDisplayName } = useAuth();
  const [accountsCreated, setAccountsCreated] = useState(0);
  const [accountsFailed, setAccountsFailed] = useState(0);
  const [show, setShow] = useState(false);

  async function createEmployeeAccount(email: string, password: string) {
    try {
      const userCredential = await enroll(email, password, secondaryAuth);

      await updateDisplayName(email.split("@")[0]);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        admin: false,
        company: doc(secondaryDB, `companies/${currentUser!.companyId}`),
        companyId: currentUser!.companyId,
        displayName: email.split("@")[0],
        lastClaim: null,
        photoName: null,
        photoURL: null,
        email: email,
        points: 0,
        pointsCollected: 0,
        pointsSpent: 0,
      });

      console.log("email created succesfully!", email, password);
      setAccountsCreated(curr => curr + 1);
    } catch {
      setAccountsFailed(curr => curr + 1);
    }
  }

  async function handleFileSelect(e: FileWithPath[]) {
    const file = e[0];
    const reader = new FileReader();

    reader.onload = async function (event) {
      setLoading(true);
      setAccountsCreated(0);
      setAccountsFailed(0);

      const contents = event.target!.result;
      const emails = (contents as string).split(",");

      const accounts: EmployeeAccount[] = emails.map(email => ({ email, password: generatePassword() }));

      await Promise.all(accounts.map(async account => createEmployeeAccount(account.email, account.password)));

      await setDoc(
        doc(db, "companies", currentUser!.companyId),
        { totalEmployees: currentUser?.company.totalEmployees! + accountsCreated },
        { merge: true }
      );

      setCurrentUser((curr: CurrentUser | null) => ({
        ...curr,
        company: { ...curr?.company, totalEmployees: currentUser!.company.totalEmployees + accountsCreated },
      }));

      setShow(true);

      setLoading(false);
    };

    reader.readAsText(file);
  }

  return (
    <div>
      <div className={classes.wrapper}>
        <Dropzone
          loading={loading}
          openRef={openRef}
          onDrop={handleFileSelect}
          className={classes.dropzone}
          radius="md"
          accept={[MIME_TYPES.csv]}
          maxFiles={1}
          maxSize={30 * 1024 ** 2}
        >
          <div style={{ pointerEvents: "none" }}>
            <Group position="center">
              <Dropzone.Accept>
                <MdFileUpload size={rem(40)} color={theme.colors[theme.primaryColor][6]} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <MdClose size={rem(40)} color={theme.colors.red[6]} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <MdOutlineUploadFile
                  size={rem(40)}
                  color={theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black}
                />
              </Dropzone.Idle>
            </Group>

            <Text ta="center" fw={700} fz="md" mt="sm">
              <Dropzone.Accept>Drop file here</Dropzone.Accept>
              <Dropzone.Reject>Csv file less than 30mb</Dropzone.Reject>
              <Dropzone.Idle>Upload your employees email list</Dropzone.Idle>
            </Text>
            <Text ta="center" fz="xs" mt="xs" c="dimmed">
              Drag&apos;n&apos;drop files here to upload. We can accept only <i>.csv</i> files that are less than 30mb
              in size.
            </Text>
          </div>
        </Dropzone>
        {!loading && (
          <Button className={classes.control} radius="xl" onClick={() => openRef.current?.()}>
            Select files
          </Button>
        )}
      </div>
      <Box className={classes.box}>
        <Text size="sm" span className={classes.boxItemsCenter}>
          Total employees: {currentUser?.company.totalEmployees}
        </Text>
        {show && (
          <div className={classes.boxItemsCenter}>
            <Text size="sm" span color="green" className={classes.boxItemsCenter}>
              Created: {accountsCreated}
            </Text>

            <Text size="sm" span color="red" className={classes.boxItemsCenter}>
              Failed: {accountsFailed}
            </Text>
          </div>
        )}
      </Box>
    </div>
  );
}
