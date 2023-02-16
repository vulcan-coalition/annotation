from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os

dir_path = os.path.dirname(os.path.realpath(__file__))


app = FastAPI()


@ app.on_event("startup")
async def startup_event():
    print("Test is starting up.")


@ app.on_event("shutdown")
def shutdown_event():
    print("Test is exiting.", "Wait a moment until completely exits.")


app.mount("/", StaticFiles(directory="js"))


if __name__ == '__main__':
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8000, log_level="info")
