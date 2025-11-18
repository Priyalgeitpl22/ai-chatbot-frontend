import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState, useEffect } from "react";
import { AppDispatch, RootState } from "../../../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  createMultipleDynamicData,
  fetchDynamicData,
  deleteDynamicData,
} from "../../../../redux/slice/dynamicDataSlice";
import { toast } from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

interface NewEntry {
  id: string; // local id for form management
  dbId?: string; // database id if it's an existing entry
  prompt: string;
  apiCurl: string;
}

export default function DynamicData() {
  const [newEntries, setNewEntries] = useState<NewEntry[]>([
    { id: Date.now().toString(), prompt: "", apiCurl: "" },
  ]);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { dynamicDataList, loading } = useSelector(
    (state: RootState) => state.dynamicData
  );

  useEffect(() => {
    if (user?.orgId) {
      dispatch(fetchDynamicData(user.orgId));
    }
  }, [dispatch, user?.orgId]);

  // Populate form with fetched data
  useEffect(() => {
    if (dynamicDataList?.length > 0) {
      const populatedEntries = dynamicDataList?.map(
        (item: any, index: number) => ({
          id: item.id || `entry-${index}-${Date.now()}`,
          dbId: item.id,
          prompt: item.prompt || "",
          apiCurl: item.apiCurl || "",
        })
      );
      setNewEntries(populatedEntries);
    } else if (!loading) {
      // Only reset if not loading and no data
      setNewEntries([{ id: Date.now().toString(), prompt: "", apiCurl: "" }]);
    }
  }, [dynamicDataList?.length, loading]);

  const addNewEntry = () => {
    setNewEntries([
      ...newEntries,
      { id: Date.now().toString(), prompt: "", apiCurl: "" },
    ]);
  };

  const removeNewEntry = (id: string) => {
    if (newEntries.length > 1) {
      setNewEntries(newEntries.filter((entry) => entry.id !== id));
    } else {
      toast.error("At least one entry is required");
    }
  };

  const updateNewEntry = (
    id: string,
    field: "prompt" | "apiCurl",
    value: string
  ) => {
    setNewEntries(
      newEntries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const saveAllEntries = async () => {
    const validEntries = newEntries.filter(
      (entry) =>
        entry.prompt &&
        entry.apiCurl &&
        entry.prompt.trim() &&
        entry.apiCurl.trim()
    );

    if (validEntries.length === 0) {
      toast.error("Please fill in at least one complete entry");
      return;
    }

    try {
      const entriesToUpdate = validEntries.filter((entry) => entry.dbId);
      const entriesToCreate = validEntries.filter((entry) => !entry.dbId);

      // For updates: delete old entries first, then create new ones
      const deletePromises = entriesToUpdate.map((entry) =>
        dispatch(deleteDynamicData(entry.dbId!)).unwrap()
      );

      // Wait for all deletions to complete
      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
      }

      // Create all entries (both new and updated ones)
      const allEntriesToCreate = [
        ...entriesToUpdate.map((entry) => ({
          prompt: entry.prompt,
          apiCurl: entry.apiCurl,
        })),
        ...entriesToCreate.map((entry) => ({
          prompt: entry.prompt,
          apiCurl: entry.apiCurl,
        })),
      ];

      if (allEntriesToCreate.length > 0) {
        await dispatch(
          createMultipleDynamicData({
            orgId: user?.orgId || "",
            data: allEntriesToCreate,
          })
        ).unwrap();
      }

      const updateCount = entriesToUpdate.length;
      const createCount = entriesToCreate.length;
      let message = "";
      if (updateCount > 0 && createCount > 0) {
        message = `${updateCount} entr${
          updateCount > 1 ? "ies" : "y"
        } updated and ${createCount} entr${
          createCount > 1 ? "ies" : "y"
        } created successfully`;
      } else if (updateCount > 0) {
        message = `${updateCount} entr${
          updateCount > 1 ? "ies" : "y"
        } updated successfully`;
      } else {
        message = `${createCount} entr${
          createCount > 1 ? "ies" : "y"
        } created successfully`;
      }

      toast.success(message);

      // Refresh list to get updated IDs
      if (user?.orgId) {
        dispatch(fetchDynamicData(user.orgId));
      }
    } catch (error) {
      toast.error((error as string) || "Failed to save dynamic data");
    }
  };

  const handleDelete = async (dbId: string, localId: string) => {
    if (
      window.confirm("Are you sure you want to delete this dynamic data entry?")
    ) {
      try {
        await dispatch(deleteDynamicData(dbId)).unwrap();
        // Remove from local state
        setNewEntries(newEntries.filter((entry) => entry.id !== localId));
        toast.success("Dynamic data deleted successfully");
        if (user?.orgId) {
          dispatch(fetchDynamicData(user.orgId));
        }
      } catch (error) {
        toast.error((error as string) || "Failed to delete dynamic data");
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          border: "1px solid #ccc",
          borderRadius: 2,
          p: 3,
          boxSizing: "border-box",
          height: "fit-content",
        }}
      >
        <Typography variant="h6" sx={{ mb: 3 }}>
          Dynamic Data Configuration
        </Typography>

        {loading && newEntries.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
              Dynamic Data Entries
            </Typography>

            {newEntries.map((entry, index) => (
              <Box key={entry.id} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "#666" }}
                  >
                    Entry {index + 1}{" "}
                    {entry.dbId && (
                      <span style={{ color: "#999", fontSize: "0.85em" }}>
                        (Existing)
                      </span>
                    )}
                  </Typography>
                  <Box>
                    {entry.dbId && (
                      <IconButton
                        size="small"
                        onClick={() =>
                          entry.dbId && handleDelete(entry.dbId, entry.id)
                        }
                        color="error"
                        sx={{ mr: 1 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                    {newEntries.length > 1 && !entry.dbId && (
                      <IconButton
                        size="small"
                        onClick={() => removeNewEntry(entry.id)}
                        color="error"
                      >
                        <RemoveCircleOutlineIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <TextField
                      label="Prompt"
                      multiline
                      rows={3}
                      fullWidth
                      value={entry.prompt}
                      onChange={(e) =>
                        updateNewEntry(entry.id, "prompt", e.target.value)
                      }
                      placeholder="Enter your AI prompt..."
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      label="Url"
                      fullWidth
                      value={entry.apiCurl}
                      onChange={(e) =>
                        updateNewEntry(entry.id, "apiCurl", e.target.value)
                      }
                      placeholder="Enter curl endpoint..."
                    />
                  </Grid>
                </Grid>
                {index < newEntries.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}

            {/* Save All Button */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 3,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addNewEntry}
                sx={{ textTransform: "none" }}
              >
                Add New
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={saveAllEntries}
                disabled={
                  loading ||
                  newEntries.every(
                    (e) =>
                      !e.prompt ||
                      !e.apiCurl ||
                      !e.prompt.trim() ||
                      !e.apiCurl.trim()
                  )
                }
                sx={{ textTransform: "none", px: 4 }}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  `Save All (${
                    newEntries.filter(
                      (e) =>
                        e.prompt &&
                        e.apiCurl &&
                        e.prompt.trim() &&
                        e.apiCurl.trim()
                    ).length
                  })`
                )}
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {loading && (<Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress size={20} color="inherit" />
      </Box>)}
    </>
  );
}
