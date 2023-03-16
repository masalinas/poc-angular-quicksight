import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import * as QuickSightEmbedding from 'amazon-quicksight-embedding-sdk';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'poc-angular-quicksight';

  containerDiv: any;

  frameOptions: QuickSightEmbedding.QSE.FrameOptions;
  contentOptions: QuickSightEmbedding.QSE.ContentOptions;
  embeddingContext: QuickSightEmbedding.QSE.EmbeddingContext;
  dashboardFrame : QuickSightEmbedding.QSE.DashboardFrame;

  dashboardURL: string = "MY_DASHBOARD_URI";

  async ngOnInit() {
    this.containerDiv = document.getElementById("dashboardContainer");

    this.frameOptions = {
      url: this.dashboardURL, 
      container: this.containerDiv,
      width: '100%',
      height: '100%',
      onChange: (changeEvent, metadata) => {
        if (changeEvent.eventLevel === 'ERROR') {
            console.log(`Do something when embedding experience failed with "${changeEvent.eventName}"`);
            return;
        }
        switch (changeEvent.eventName) {
            case 'FRAME_MOUNTED': {
                console.log("Do something when the experience frame is mounted.");
                break;
            }
            case 'FRAME_LOADED': {
                console.log("Do something when the experience frame is loaded.");
                break;
            }
            //...
        }
      },
    };
    
    this.contentOptions = {
        parameters: [
          {
              Name: 'country',
              Values: [
                  'United States'
              ],
          },
          {
              Name: 'states',
              Values: [
                  'California',
                  'Washington'
              ]
          }
      ],
      locale: "en-US",
      /*sheetOptions: {
          initialSheetId: '<YOUR_SHEETID>',
          singleSheet: false,                        
          emitSizeChangedEventOnSheetChange: false,
      },*/
      toolbarOptions: {
          export: false,
          undoRedo: false,
          reset: false
      },
      attributionOptions: {
          overlayContent: false,
      },
      onMessage: async (messageEvent, experienceMetadata) => {
        switch (messageEvent.eventName) {
          case 'CONTENT_LOADED': {
            console.log("All visuals are loaded. The title of the document:", messageEvent.message.title);
            break;
        }
        case 'ERROR_OCCURRED': {
            console.log("Error occurred while rendering the experience. Error code:", messageEvent.message.errorCode);
            break;
        }
        case 'PARAMETERS_CHANGED': {
            console.log("Parameters changed. Changed parameters:", messageEvent.message.changedParameters);
            break;
        }
        case 'SELECTED_SHEET_CHANGED': {
            console.log("Selected sheet changed. Selected sheet:", messageEvent.message.selectedSheet);
            break;
        }
        case 'SIZE_CHANGED': {
            console.log("Size changed. New dimensions:", messageEvent.message);
            break;
        }
        case 'MODAL_OPENED': {
            window.scrollTo({
                top: 0 // iframe top position
            });
            break;
        }
      }
    }
    }

    this.embeddingContext = await QuickSightEmbedding.createEmbeddingContext({
      onChange: (changeEvent) => {
          console.log('Context received a change', changeEvent);
      },
   });

   this.dashboardFrame = await this.embeddingContext.embedDashboard(this.frameOptions, this.contentOptions);
  }

  onDashboard(evebt: any) {
    console.log("Hello Dashboard");
  }  
}
