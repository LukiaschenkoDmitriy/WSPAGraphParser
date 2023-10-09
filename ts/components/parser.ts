

interface ISubjectGraph {
    name: string;
    room: string;
    subGroup: string;
    teacher: string;
    type: string;
    online: boolean;
    hours: number;
    startTime : Date;
    endTime: Date;
    dates: string[];
    parrent: IGroupGraph | IDayGraph | IDirectionGraph | ISubjectGraph;
}

interface IGroupGraph {
    subjects: ISubjectGraph[];
    group: string;
    parrent: IGroupGraph | IDayGraph | IDirectionGraph | ISubjectGraph;
}

interface IDayGraph {
    groups: IGroupGraph[];
    nameDay: string;
    parrent: IGroupGraph | IDayGraph | IDirectionGraph | ISubjectGraph;
}

interface IDirectionGraph {
    days: IDayGraph[];
    nameDirection: string;
}

class SubjectGraph implements ISubjectGraph {
    parrent: IGroupGraph | IDayGraph | IDirectionGraph | ISubjectGraph;
    name: string = "";
    room: string = "";
    subGroup: string = "";
    teacher: string = "";
    type: string = "";
    online: boolean = false;
    hours: number = 15;
    startTime: Date = new Date();
    endTime: Date = new Date();
    dates: string[] = [];

    public constructor(
      workSheet: Worksheet, 
      parrent: IGroupGraph | IDayGraph | IDirectionGraph | ISubjectGraph,
      col: number, 
      row: number
    ) 
    {
      this.parrent = parrent;
      let cell = workSheet.getCell(7,3).value;
      if (cell instanceof RichText) {

      }
    }
}

class GroupGraph implements IGroupGraph {
  parrent: IGroupGraph | IDayGraph | IDirectionGraph | ISubjectGraph;
  subjects: ISubjectGraph[];
  group: string;

  public constructor
  (
    workSheet: Worksheet, 
    parrent: IGroupGraph | IDayGraph | IDirectionGraph | ISubjectGraph,
    col: number
  )
  {
    this.parrent = parrent;
    this.group = workSheet.getCell(4, col).text;
    this.subjects = [];

    for (let i = 6; i <= workSheet.rowCount - 1; i++) {
      this.subjects.push(new SubjectGraph(workSheet, this, i, col));
    }
  }
}

class DayGraph implements IDayGraph {
  groups: IGroupGraph[];
  nameDay: string;
  parrent: IGroupGraph | IDayGraph | IDirectionGraph | ISubjectGraph;

  public constructor
  (
    workSheet: Worksheet, 
    parrent: IGroupGraph | IDayGraph | IDirectionGraph | ISubjectGraph,
    col: number, 
  )
  {
    this.parrent = parrent;
    this.nameDay = workSheet.getCell(3, col).text;
    this.groups = [];

    let lastDay = "";

    for(let i = 2; i <= workSheet.columnCount; i++) {
      let text = workSheet.getCell(3, i).text;

      lastDay = (text == "") ? lastDay : text;
      if (lastDay == this.nameDay) this.groups.push(new GroupGraph(workSheet, this, i));

    }
  }
}

class DirectionGraph implements IDirectionGraph {
  nameDirection: string;
  days: IDayGraph[];

  public constructor(workSheet: Worksheet) 
  {
    this.days = [];
    this.nameDirection = workSheet.getCell(1, 1).text
    
    let daysRow = workSheet.getRow(3);

    for (let i = 2; i <= daysRow.cellCount; i++) {
      let dayGraph = new DayGraph(workSheet, this, i);
      let dayRepeat = false;

      for(let x = 0; x < this.days.length; x++) {
        if (this.days[x].nameDay == dayGraph.nameDay || dayGraph.nameDay == "") {
          dayRepeat = true;
          break;
        }
      }

      if (!dayRepeat) this.days.push(dayGraph);
    }
  }
}

export class WSPAGraphParser {
    private workBook: Workbook | null = null;
  
    public async initialize(xlsxFilePath: string): Promise<void> {
      try {
        this.workBook = new Workbook();
        await this.workBook.xlsx.readFile(xlsxFilePath);
        const workSheet: Worksheet = this.workBook.worksheets[0];

        //console.log(new DirectionGraph(workSheet).days[0].groups[0]);
        
        
        console.log(new SubjectGraph(workSheet, {nameDirection: "", days: []}, 7, 2).name);

      } catch (error) {
        console.error('Error initializing workbook:', error);
      }
    }
  }