function Upload() {
  return (
    <div>
      <form class="mt-4" action="http://localhost:3001/submit" method="POST" enctype="multipart/form-data">
        <div class="form-group">
          <input type="text" name="studentId" id="studentId" />
          <input type="text" name="assignmentId" id="assignmentId" />
          <input type="file" name="file" id="input-files" class="form-control-file border" />
        </div>
        <button type="submit" class="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Upload;
