package Strikeboom.StrikesGames.game;

import Strikeboom.StrikesGames.exception.SettingNotFoundException;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class GameSettings {
    private final List<GameSetting> settings;
    public GameSettings() {
        this.settings = new ArrayList<>();
    }
    public GameSettings addSetting(GameSetting setting) {
        settings.add(setting);
        return this;
    }
    public <T> T update(String key, T value) {
        for (GameSetting setting : settings) {
            if (setting.key.equals(key)) {
                if (setting.type == GameSetting.Type.INTEGER && value instanceof Integer) {
                    setting.value = value;
                    return value;
                }
                if (setting.type == GameSetting.Type.BOOLEAN && value instanceof Boolean) {
                    setting.value = value;
                    return value;
                }
            }
        }
        throw new SettingNotFoundException(String.format("Setting %s not found or not desired value!",key));
    }
    public int getInt(String key) {
        for (GameSetting setting : settings) {
            if (setting.key.equals(key)) {
                if (setting.type == GameSetting.Type.INTEGER) {
                    return (int) setting.value;
                } else {
                    throw new IllegalArgumentException("Setting is not desired value! Setting is type " + setting.type);
                }
            }
        }
        throw new SettingNotFoundException(String.format("Setting %s not found!",key));
    }
    public boolean getBoolean(String key) {
        for (GameSetting setting : settings) {
            if (setting.key.equals(key)) {
                if (setting.type == GameSetting.Type.BOOLEAN) {
                    return (boolean) setting.value;
                } else {
                    throw new IllegalArgumentException("Setting is not desired value! Setting is type " + setting.type);
                }
            }
        }
        throw new SettingNotFoundException(String.format("Setting %s not found!",key));
    }
}
