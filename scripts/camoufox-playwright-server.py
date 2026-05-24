import base64
import os
import subprocess
from pathlib import Path

import orjson

from camoufox.server import LAUNCH_SCRIPT, get_nodejs, to_camel_case_dict
from camoufox.utils import launch_options


def remove_none_values(value):
    if isinstance(value, dict):
        return {
            key: remove_none_values(item)
            for key, item in value.items()
            if item is not None
        }
    if isinstance(value, list):
        return [remove_none_values(item) for item in value]
    return value


def main():
    headless = os.environ.get("CAMOUFOX_HEADLESS", "0").lower() in {
        "1",
        "true",
        "yes",
        "on",
    }

    config = launch_options(
        os="windows",
        headless=headless,
        humanize=True,
        disable_coop=True,
        main_world_eval=True,
        window=(1366, 768),
        i_know_what_im_doing=True,
    )
    config = remove_none_values(to_camel_case_dict(config))

    nodejs = get_nodejs()
    process = subprocess.Popen(
        [nodejs, str(LAUNCH_SCRIPT)],
        cwd=Path(nodejs).parent / "package",
        stdin=subprocess.PIPE,
        text=True,
    )

    if process.stdin:
        data = orjson.dumps(config)
        process.stdin.write(base64.b64encode(data).decode())
        process.stdin.close()

    raise SystemExit(process.wait())


if __name__ == "__main__":
    main()
