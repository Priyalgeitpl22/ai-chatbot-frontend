import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  Stack,
  Button,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserSettings,
  saveUserSettings,
} from "../../../redux/slice/settingsSlice";
import { AppDispatch, RootState } from "../../../redux/store/store";
import {
  Container,
  Title,
  Label,
  SaveButtonWrapper,
  CustomButton,
  TitleWrapper,
  CustomWrapper,
} from "./notificationSettingsStyled";
import toast, { Toaster } from "react-hot-toast";

const notificationSounds = [
  { name: "Chime", file: "chime.mp3" },
  { name: "Ping", file: "ping.mp3" },
  { name: "Pop", file: "pop.mp3" },
  { name: "Echo", file: "echo.mp3" },
  { name: "Beep", file: "beep.mp3" },
];

const DEFAULT_SETTINGS = {
  selectedSound: "chime.mp3",
  isSoundOn: true,
};

const NotificationSettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);

  const [selectedSound, setSelectedSound] = useState(DEFAULT_SETTINGS.selectedSound);
  const [isSoundOn, setIsSoundOn] = useState(DEFAULT_SETTINGS.isSoundOn);
  const audioRef = useRef<HTMLAudioElement | null>(null);



  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserSettings(user.id)).then((res: any) => {
        const data = res.payload?.settings?.notification;
        if (data) {
          setSelectedSound(data.selectedSound);
          setIsSoundOn(data.isSoundOn);
        } else {
          dispatch(
            saveUserSettings({
              userId: user.id,
              category: "notification",
              data: DEFAULT_SETTINGS,
            })
          );
        }
      });
    }
  }, [dispatch, user?.id]);

  const handleToggle = () => setIsSoundOn((prev) => !prev);

  const handleSoundChange = (event: SelectChangeEvent<string>) => {
    const newSound = event.target.value;
    setSelectedSound(newSound);
    if (isSoundOn) {
      playSound(newSound);
    }
  };

  const handleSave = () => {
    if (!user?.id) return;
    dispatch(
      saveUserSettings({
        userId: user.id,
        category: "notification",
        data: {
          selectedSound,
          isSoundOn,
        },
      })
    ).then(() => {
      dispatch(fetchUserSettings(user.id));
      toast.success("Settings saved successfully!");
    })
    .catch(() => {
      toast.error("Failed to save settings");
    });
  };

  const playSound = (file: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  
    const audio = new Audio(`/sounds/${file}`);
    audioRef.current = audio;
    audio.play().catch((err) => {
      console.error("🔊 Error playing sound:", err);
      toast.error("Could not play sound. Check your browser and file path.");
    });
  };
  

  return (
    <Container>
      <Toaster />
      <TitleWrapper>
        <Title>Notification Settings</Title>
      </TitleWrapper>
      <CustomWrapper>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Label>Notification Sound</Label>
        <Switch checked={isSoundOn} onChange={handleToggle} />
      </Stack>

      <Label>Widget Message Sound</Label>

      <FormControl fullWidth disabled={!isSoundOn}>
        <InputLabel id="sound-select-label">Select Sound</InputLabel>
        <Select
          labelId="sound-select-label"
          value={selectedSound}
          label="Select Sound"
          onChange={handleSoundChange}
        >
          {notificationSounds.map(({ name, file }) => (
            <MenuItem key={file} value={file}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button onClick={() => playSound(selectedSound)} sx={{ mt: 2 }}>
        Test Sound
      </Button>

      <SaveButtonWrapper>
        <CustomButton variant="contained" onClick={handleSave}>
          Save
        </CustomButton>
      </SaveButtonWrapper>
      </CustomWrapper>
    </Container>
  );
};

export default NotificationSettings;
